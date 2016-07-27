import React from 'react'
import { Button, DropdownButton, MenuItem, Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import SqlEditor from './SqlEditor'
import shortid from 'shortid'
import Link from './Link'

var queryCount = 1;

const QueryEditors = React.createClass({
  renameTab: function (qe) {
    var newTitle = prompt("Enter a new title for the tab");
    if (newTitle) {
      this.props.actions.queryEditorSetTitle(qe, newTitle);
    }
  },
  newQueryEditor: function () {
    queryCount++;
    var dbId = (this.props.workspaceDatabase) ? this.props.workspaceDatabase.id : null;
    var qe = {
      id: shortid.generate(),
      title: `Query ${queryCount}`,
      dbId: dbId,
      autorun: false,
      sql: 'SELECT ...'
    };
    this.props.actions.addQueryEditor(qe);
  },
  handleSelect(key) {
    if (key === 'add_tab') {
      this.newQueryEditor();
    } else {
      this.props.actions.setActiveQueryEditor({ id: key });
    }
  },
  render: function () {
    var that = this;
    var editors = this.props.queryEditors.map(function (qe, i) {
      var latestQuery = null;
      that.props.queries.forEach((q) => {
        if (q.id == qe.latestQueryId) {
          latestQuery = q;
        }
      });
      var state = (latestQuery) ? latestQuery.state : '';
      var tabTitle = (
        <div>
          <div className={"circle " + state} /> {qe.title} {' '}
          <DropdownButton
              bsSize="small"
              className="no-shadow"
              id="bg-vertical-dropdown-1">
            <MenuItem eventKey="1" onClick={that.props.actions.removeQueryEditor.bind(that, qe)}>
              <i className="fa fa-close" /> close tab
            </MenuItem>
            <MenuItem eventKey="2" onClick={that.renameTab.bind(that, qe)}>
              <i className="fa fa-i-cursor" /> rename tab
            </MenuItem>
          </DropdownButton>
        </div>
      );
      return (
        <Tab
          key={qe.id}
          title={tabTitle}
          eventKey={qe.id}>
            <SqlEditor
              name={qe.id}
              queryEditor={qe}
              latestQuery={latestQuery}
              callback={that.render.bind(that)}/>
        </Tab>);
    });
    return (
      <Tabs activeKey={this.props.tabHistory[this.props.tabHistory.length-1]} onSelect={this.handleSelect}>
        {editors}
        <Tab title={<div><i className="fa fa-plus-circle"/>&nbsp;</div>} eventKey="add_tab"/>
      </Tabs>
    );
  }
});

function mapStateToProps(state) {
  return {
    queryEditors: state.queryEditors,
    queries: state.queries,
    workspaceDatabase: state.workspaceDatabase,
    tabHistory: state.tabHistory,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryEditors)
