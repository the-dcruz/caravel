import React, { PropTypes } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import moment from 'moment';


const Timer = React.createClass({
  getInitialState: function() {
    return { clockStr: '' };
  },
  propTypes: {
    query: React.PropTypes.object,
  },
  getDefaultProps() {
    return {
      query: null,
    };
  },
  componentWillMount: function () {
    this.timer = setInterval(this.stopwatch, 50);
  },
  componentWillUnmount: function() {
    clearInterval(this.timer);
  },
  stopwatch: function () {
    let clockStr = null;
    if (this.props.query) {
      let fromDttm = this.props.query.endDttm || new Date();
      fromDttm = moment(fromDttm);
      let duration = fromDttm - moment(this.props.query.startDttm).valueOf();
      duration = moment.utc(duration);
      clockStr = duration.format('HH:mm:ss.SS');
      this.setState({ clockStr: clockStr });
    }
  },
  render() {
    let timerSpan = null;
    if (this.props.query) {
      timerSpan= (
        <span className={"label label-warning inlineBlock m-r-5 " + this.props.query.state}>
          {this.state.clockStr}
        </span>
      );
    }
    return timerSpan;
  },
});

export default Timer
