import { Tab, Tabs } from 'react-bootstrap';
import QueryLog from './QueryLog'
import ResultSet from './ResultSet';
import React from 'react';

const SouthPane = React.createClass({
  render: function () {
    if (this.props.latestQuery) {
      if (this.props.latestQuery.state == 'running') {
        var results = <img className="loading" src="/static/assets/images/loading.gif"/>;
      }
      else if (this.props.latestQuery.state == 'failed') {
        var results = <div className="alert alert-danger">{this.props.latestQuery.msg}</div>;
      }
      else if (this.props.latestQuery.state == 'success') {
        var results = <ResultSet resultset={this.props.latestQuery.results} />
      }
    }
    else {
      var results = <div className="alert alert-info">Run a query to display results here</div>
    }
    var data = [];
    var selectRowProp = {
      mode: "checkbox",
      clickToSelect: false,
    };
    var cellEditProp = {
      mode: "click",
      blurToSave: true,
    }
    return (
      <Tabs bsStyle="pills">
        <Tab title="Results" eventKey={1}>
          <div style={{ overflow: 'auto' }}>
            {results}
          </div>
        </Tab>
        <Tab title="Query Log" eventKey={2}>
          <QueryLog/>
        </Tab>
      </Tabs>
    );
  }
});

export default SouthPane
