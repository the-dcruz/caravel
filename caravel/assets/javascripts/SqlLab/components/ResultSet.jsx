import React, { PropTypes } from 'react'
import { Alert } from 'react-bootstrap'
import { Table } from 'reactable';


const ResultSet = React.createClass({
  shouldComponentUpdate() {
    return false;
  },
  render() {
    if (this.props.resultset.data.length > 0) {
      return (
        <Table
          data={this.props.resultset.data}
          columns={this.props.resultset.columns}
          sortable={true}
          className="table table-condensed"/>
      );
    } else {
      return(<Alert bsStyle="warning">The query returned no data</Alert>);
    }
  }
});

export default ResultSet
