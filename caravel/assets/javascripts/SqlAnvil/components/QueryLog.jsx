import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import { BootstrapTable } from 'react-bootstrap-table';
import moment from 'moment'
import Link from './Link'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/styles';

const STATE_COLOR_MAP = {
  failed: 'red',
  running: 'lime',
  success: 'green',
};

const QueryLog = React.createClass({
  render: function () {
    var data = this.props.queries.map((q) => {
      var q = Object.assign({}, q);
      var since = (q.endDttm) ? q.endDttm : moment();
      var duration = since.valueOf() - q.startDttm.valueOf();
      duration = moment.utc(duration);
      q.duration = duration.format('HH:mm:ss.SS');
      q.started = q.startDttm.format('HH:mm:ss');
      q.sql = <SyntaxHighlighter language="sql" style={github}>{q.sql}</SyntaxHighlighter>;
      q.state = (
        <span
            className="label label-default"
            style={{'background-color': STATE_COLOR_MAP[q.state]}}>
          {q.state}
        </span>
      );
      q.actions = (
        <Link className="fa fa-play" href="#"/>
      );

      return q;
    }).reverse();
    return (
      <BootstrapTable
          condensed={true}
          data={data}>
        <TableHeaderColumn dataField="id" isKey={true} hidden={true}></TableHeaderColumn>
        <TableHeaderColumn dataField="state">state</TableHeaderColumn>
        <TableHeaderColumn dataField="started">started</TableHeaderColumn>
        <TableHeaderColumn dataField="tab">tab</TableHeaderColumn>
        <TableHeaderColumn dataField="rows">rows</TableHeaderColumn>
        <TableHeaderColumn dataField="sql">sql</TableHeaderColumn>
        <TableHeaderColumn dataField="actions">actions</TableHeaderColumn>
      </BootstrapTable>
    )
  }
});

function mapStateToProps(state) {
  return {
    queryEditors: state.queryEditors,
    queries: state.queries
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryLog)
