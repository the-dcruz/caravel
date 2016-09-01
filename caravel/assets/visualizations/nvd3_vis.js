// JS
import { category21 } from '../javascripts/modules/colors';
import { timeFormatFactory, formatDate } from '../javascripts/modules/dates';
const d3 = require('d3');
const nv = require('nvd3');

// CSS
require('../node_modules/nvd3/build/nv.d3.min.css');
require('./nvd3_vis.css');

const minBarWidth = 15;
const animationTime = 1000;

const addTotalBarValues = function (chart, data, stacked) {
  const svg = d3.select('svg');
  const format = d3.format('.3s');
  const countSeriesDisplayed = data.length;

  const totalStackedValues = stacked && data.length !== 0 ?
    data[0].values.map(function (bar, iBar) {
      const bars = data.map(function (series) {
        return series.values[iBar];
      });
      return d3.sum(bars, function (d) {
        return d.y;
      });
    }) : [];

  const rectsToBeLabeled = svg.selectAll('g.nv-group').filter(
    function (d, i) {
      if (!stacked) {
        return true;
      }
      return i === countSeriesDisplayed - 1;
    }).selectAll('rect.positive');

  const groupLabels = svg.select('g.nv-barsWrap').append('g');
  rectsToBeLabeled.each(
    function (d, index) {
      const rectObj = d3.select(this);
      const transformAttr = rectObj.attr('transform');
      const yPos = parseFloat(rectObj.attr('y'));
      const xPos = parseFloat(rectObj.attr('x'));
      const rectWidth = parseFloat(rectObj.attr('width'));
      const t = groupLabels.append('text')
        .attr('x', xPos) // rough position first, fine tune later
        .attr('y', yPos - 5)
        .text(format(stacked ? totalStackedValues[index] : d.y))
        .attr('transform', transformAttr)
        .attr('class', 'bar-chart-label');
      const labelWidth = t.node().getBBox().width;
      t.attr('x', xPos + rectWidth / 2 - labelWidth / 2); // fine tune
    });
};

const addVerticalLineAnnotations = function (chart, data) {
  const svg = d3.select('svg');
  svg.select('g.nv-linesWrap').append('g')
    .attr('class', 'vertical-lines');

  let annotationData = [];
  let numAnnotations = Object.keys(data['annotation_ts']).length;
  for (let i=0; i < numAnnotations; i++) {
    annotationData.push({
      'date': data['annotation_ts'][i],
      'label': data['annotation_val'][i]
    })
  }

  const vertLines = d3.select('.vertical-lines').selectAll('.vertical-line').data(annotationData);

  var vertG = vertLines.enter()
        .append('g')
        .attr('class', 'vertical-line');

  vertG.append('svg:line');
  vertG.append('text');

  vertLines.exit().remove();

  vertLines.selectAll('line')
    .attr('x1', function (d) {
       return chart.xAxis.scale()(d.date);
    })
    .attr('x2', function (d) {
      return chart.xAxis.scale()(d.date);
    })
    .attr('y1', chart.yAxis.scale().range()[0] )
    .attr('y2', chart.yAxis.scale().range()[1] )
    .style('stroke', 'blue');

  vertLines.selectAll('text')
    .text( function(d) { return d.label })
    .attr('dy', '1em')
    //x placement ; change dy above for minor adjustments but mainly
    //    change the d.date/60/60/24/1000
    //y placement ; change 2 to where you want vertical placement
    //rotate -90 but feel free to change to what you would like
    .attr('transform', function (d) {
       return  'translate(' +
        chart.xAxis.scale()(d.date) +
        ',' +
        chart.yAxis.scale()(2) +
        ') rotate(-90)'
    })
    //also you can style however you would like
    //here is an example changing the font size
    .style('font-size','80%')
};

function nvd3Vis(slice) {
  let chart;
  let colorKey = 'key';


  const render = function () {
    d3.json(slice.jsonEndpoint(), function (error, payload) {
      slice.container.html('');
      // Check error first, otherwise payload can be null
      if (error) {
        slice.error(error.responseText, error);
        return;
      }

      // Calculates the longest label size for stretching bottom margin
      function calculateStretchMargins(payloadData) {
        let stretchMargin = 0;
        const pixelsPerCharX = 4.5; // approx, depends on font size
        let maxLabelSize = 10; // accomodate for shorter labels
        payloadData.data.forEach((d) => {
          const axisLabels = d.values;
          for (let i = 0; i < axisLabels.length; i++) {
            maxLabelSize = Math.max(axisLabels[i].x.length, maxLabelSize);
          }
        });
        stretchMargin = Math.ceil(pixelsPerCharX * maxLabelSize);
        return stretchMargin;
      }

      let width = slice.width();
      const fd = payload.form_data;

      const barchartWidth = function () {
        let bars;
        if (fd.bar_stacked) {
          bars = d3.max(payload.data, function (d) { return d.values.length; });
        } else {
          bars = d3.sum(payload.data, function (d) { return d.values.length; });
        }
        if (bars * minBarWidth > width) {
          return bars * minBarWidth;
        }
        return width;
      };

      const vizType = fd.viz_type;
      const f = d3.format('.3s');
      const reduceXTicks = fd.reduce_x_ticks || false;
      let stacked = false;
      let row;
      nv.addGraph(function () {
        switch (vizType) {
          case 'line':
            if (fd.show_brush) {
              chart = nv.models.lineWithFocusChart();
              chart.focus.xScale(d3.time.scale.utc());
              chart.x2Axis
              .showMaxMin(fd.x_axis_showminmax)
              .staggerLabels(false);
            } else {
              chart = nv.models.lineChart();
            }
            // To alter the tooltip header
            // chart.interactiveLayer.tooltip.headerFormatter(function(){return '';});
            chart.xScale(d3.time.scale.utc());
            chart.interpolate(fd.line_interpolation);
            chart.xAxis
            .showMaxMin(fd.x_axis_showminmax)
            .staggerLabels(false);

            if (fd.enable_annotations) {
              setTimeout(function () {
                addVerticalLineAnnotations(chart, payload.annotations);
              }, animationTime);
            }
            break;

          case 'bar':
            chart = nv.models.multiBarChart()
            .showControls(fd.show_controls)
            .groupSpacing(0.1);

            if (!reduceXTicks) {
              width = barchartWidth();
            }
            chart.width(width);
            chart.xAxis
            .showMaxMin(false)
            .staggerLabels(true);

            stacked = fd.bar_stacked;
            chart.stacked(stacked);

            if (fd.show_bar_value) {
              setTimeout(function () {
                addTotalBarValues(chart, payload.data, stacked);
              }, animationTime);
            }
            break;

          case 'dist_bar':
            chart = nv.models.multiBarChart()
            .showControls(fd.show_controls)
            .reduceXTicks(reduceXTicks)
            .rotateLabels(45)
            .groupSpacing(0.1); // Distance between each group of bars.

            chart.xAxis
            .showMaxMin(false);

            stacked = fd.bar_stacked;
            chart.stacked(stacked);

            if (fd.show_bar_value) {
              setTimeout(function () {
                addTotalBarValues(chart, payload.data, stacked);
              }, animationTime);
            }
            if (!reduceXTicks) {
              width = barchartWidth();
            }
            chart.width(width);
            break;

          case 'pie':
            chart = nv.models.pieChart();
            colorKey = 'x';
            chart.valueFormat(f);
            if (fd.donut) {
              chart.donut(true);
            }
            chart.labelsOutside(fd.labels_outside);
            chart.labelThreshold(0.05)  // Configure the minimum slice size for labels to show up
              .labelType(fd.pie_label_type);
            chart.cornerRadius(true);
            break;

          case 'column':
            chart = nv.models.multiBarChart()
            .reduceXTicks(false)
            .rotateLabels(45);
            break;

          case 'compare':
            chart = nv.models.cumulativeLineChart();
            chart.xScale(d3.time.scale.utc());
            chart.xAxis
            .showMaxMin(false)
            .staggerLabels(true);
            break;

          case 'bubble':
            row = (col1, col2) => `<tr><td>${col1}</td><td>${col2}</td></tr>`;
            chart = nv.models.scatterChart();
            chart.showDistX(true);
            chart.showDistY(true);
            chart.tooltip.contentGenerator(function (obj) {
              const p = obj.point;
              let s = '<table>';
              s += (
                `<tr><td style="color: ${p.color};">` +
                  `<strong>${p[fd.entity]}</strong> (${p.group})` +
                '</td></tr>');
              s += row(fd.x, f(p.x));
              s += row(fd.y, f(p.y));
              s += row(fd.size, f(p.size));
              s += '</table>';
              return s;
            });
            chart.pointRange([5, fd.max_bubble_size * fd.max_bubble_size]);
            break;

          case 'area':
            chart = nv.models.stackedAreaChart();
            chart.showControls(fd.show_controls);
            chart.style(fd.stacked_style);
            chart.xScale(d3.time.scale.utc());
            chart.xAxis
            .showMaxMin(false)
            .staggerLabels(true);
            break;

          case 'box_plot':
            colorKey = 'label';
            chart = nv.models.boxPlotChart();
            chart.x(function (d) {
              return d.label;
            });
            chart.staggerLabels(true);
            chart.maxBoxWidth(75); // prevent boxes from being incredibly wide
            break;

          default:
            throw new Error('Unrecognized visualization for nvd3' + vizType);
        }

        if ('showLegend' in chart && typeof fd.show_legend !== 'undefined') {
          chart.showLegend(fd.show_legend);
        }

        let height = slice.height() - 15;

        chart.height(height);
        slice.container.css('height', height + 'px');

        if ((vizType === 'line' || vizType === 'area') && fd.rich_tooltip) {
          chart.useInteractiveGuideline(true);
        }
        if (fd.y_axis_zero) {
          chart.forceY([0]);
        } else if (fd.y_log_scale) {
          chart.yScale(d3.scale.log());
        }
        if (fd.x_log_scale) {
          chart.xScale(d3.scale.log());
        }
        let xAxisFormatter;
        if (vizType === 'bubble') {
          xAxisFormatter = d3.format('.3s');
        } else if (fd.x_axis_format === 'smart_date') {
          xAxisFormatter = formatDate;
          chart.xAxis.tickFormat(xAxisFormatter);
        } else if (fd.x_axis_format !== undefined) {
          xAxisFormatter = timeFormatFactory(fd.x_axis_format);
          chart.xAxis.tickFormat(xAxisFormatter);
        }

        if (chart.hasOwnProperty('x2Axis')) {
          chart.x2Axis.tickFormat(xAxisFormatter);
          height += 30;
        }

        if (vizType === 'bubble') {
          chart.xAxis.tickFormat(d3.format('.3s'));
        } else if (fd.x_axis_format === 'smart_date') {
          chart.xAxis.tickFormat(formatDate);
        } else if (fd.x_axis_format !== undefined) {
          chart.xAxis.tickFormat(timeFormatFactory(fd.x_axis_format));
        }
        if (chart.yAxis !== undefined) {
          chart.yAxis.tickFormat(d3.format('.3s'));
        }

        if (fd.y_axis_format) {
          chart.yAxis.tickFormat(d3.format(fd.y_axis_format));
          if (chart.y2Axis !== undefined) {
            chart.y2Axis.tickFormat(d3.format(fd.y_axis_format));
          }
        }
        chart.color((d) => category21(d[colorKey]));

        if (fd.x_axis_label && fd.x_axis_label !== '' && chart.xAxis) {
          let distance = 0;
          if (fd.bottom_margin) {
            distance = fd.bottom_margin - 50;
          }
          chart.xAxis.axisLabel(fd.x_axis_label).axisLabelDistance(distance);
        }

        if (fd.y_axis_label && fd.y_axis_label !== '' && chart.yAxis) {
          chart.yAxis.axisLabel(fd.y_axis_label);
          chart.margin({ left: 90 });
        }

        if (fd.bottom_margin === 'auto') {
          if (vizType === 'dist_bar') {
            const stretchMargin = calculateStretchMargins(payload);
            chart.margin({ bottom: stretchMargin });
          } else {
            chart.margin({ bottom: 50 });
          }
        } else {
          chart.margin({ bottom: fd.bottom_margin });
        }

        let svg = d3.select(slice.selector).select('svg');
        if (svg.empty()) {
          svg = d3.select(slice.selector).append('svg');
        }

        svg
        .datum(payload.data)
        .transition().duration(500)
        .attr('height', height)
        .attr('width', width)
        .call(chart);

        if (fd.show_markers) {
          svg.selectAll('.nv-point')
          .style('stroke-opacity', 1)
          .style('fill-opacity', 1);
        }

        return chart;
      });

      slice.done(payload);
    });
  };

  const update = function () {
    if (chart && chart.update) {
      chart.update();
    }
  };


  return {
    render,
    resize: update,
  };
}

module.exports = nvd3Vis;
