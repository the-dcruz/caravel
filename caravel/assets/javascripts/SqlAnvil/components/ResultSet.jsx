import React, { PropTypes } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Table } from 'reactable';


const ResultSet = React.createClass({
  shouldComponentUpdate() {
    return false;
  },
  render() {
    return (
      <Table
        data={this.props.resultset.data}
        columns={this.props.resultset.columns}
        sortable={true}
        className="table table-condensed"
        />
    );
  }
});

export default ResultSet
