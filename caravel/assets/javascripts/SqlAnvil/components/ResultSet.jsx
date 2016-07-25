import React, { PropTypes } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { BootstrapTable } from 'react-bootstrap-table';


const ResultSet = React.createClass({
  shouldComponentUpdate() {
    return false;
  },
  render() {
    var cols = this.props.resultset.columns.map((col, i) => {
      return (
        <TableHeaderColumn dataField={col} dataSort={true}>
          {col}
        </TableHeaderColumn>
      );
    });
    var data = this.props.resultset.data.map((row, i) => {
      row['__id'] = i;
      return row;
    });
    return (
      <BootstrapTable
          condensed={true}
          striped={true}
          data={this.props.resultset.data}>
        <TableHeaderColumn dataField="__id" isKey={true} hidden={true}>id</TableHeaderColumn>
        {cols}
      </BootstrapTable>
    );
  }
});

export default ResultSet
