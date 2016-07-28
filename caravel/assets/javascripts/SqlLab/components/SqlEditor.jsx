import React from 'react'
import { Button, ButtonGroup, DropdownButton, MenuItem, Label, FormControl, FormGroup } from 'react-bootstrap';

import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import shortid from 'shortid';
import Select from 'react-select';
import ButtonWithTooltip from './ButtonWithTooltip';
import SouthPane from './SouthPane'
import Timer from './Timer'


// CSS
import 'react-select/dist/react-select.css';

const SqlEditor = React.createClass({
  getInitialState: function() {
    return {
      sql: this.props.queryEditor.sql,
      autorun: this.props.queryEditor.autorun,
      databaseOptions: [],
      databaseLoading: true,
    };
  },
  componentDidMount: function () {
    this.fetchDatabaseOptions();
    if (this.state.autorun) {
      this.setState({ autorun: false });
      this.props.actions.queryEditorSetAutorun(this.props.queryEditor, false);
      this.startQuery();
    }
  },
  fetchDatabaseOptions: function(input, callback) {
    this.setState({ databaseLoading: true });
    var that = this;
    var url = "//" + window.location.host + '/databaseasync/api/read';
    $.get(url, function (data) {
      var options = data.result.map((db) => {
        return { value: db.id, label: db.database_name };
      });
      that.setState({ databaseOptions: options });
      that.setState({ databaseLoading: false });
      that.render();
    });
    this.render();
  },
  startQuery: function () {
    var that = this;
    var query = {
      id: shortid.generate(),
      sqlEditorId: this.props.queryEditor.id,
      sql: this.state.sql,
      state: 'running',
      tab: this.props.queryEditor.title,
      dbId: this.props.queryEditor.dbId,
      startDttm: new Date(),
    };
    var url = "//" + window.location.host + "/caravel/sql_json/"
    var data = {
      sql: this.state.sql,
      database_id: this.props.queryEditor.dbId,
      json: true
    };
    this.props.actions.startQuery(query);
    $.ajax({
      type: "POST",
      dataType: "json",
      url,
      data,
      success: function (data) {
        try {
          that.props.actions.querySuccess(query, data);
        } catch (e) {
          that.props.actions.queryFailed(query, e);
        }
      },
      error: function (err, err2) {
        var msg = "";
        try {
          msg = err.responseJSON.msg;
        } catch (e) {
          msg = (err.responseText) ? err.responseText : e;
        }
        that.props.actions.queryFailed(query, msg);
      },
    });
  },
  stopQuery: function () {
    this.props.actions.stopQuery(this.props.latestQuery);
  },
  changeDb: function (db) {
    this.props.actions.queryEditorSetDb(this.props.queryEditor, db.value);
    this.render();
  },
  textChange: function (text) {
    this.setState({ sql: text });
  },
  notImplemented() {
    alert("Not implemented");
  },
  addWorkspaceQuery: function () {
    this.props.actions.addWorkspaceQuery({
      id: shortid.generate(),
      sql: this.state.sql,
      dbId: this.props.queryEditor.dbId,
      title: this.props.queryEditor.title,
    });
  },
  ctasChange() {
  },
  visualize() {
  },
  render() {
    this.props.callback();
    var body = (<div/>);
    var runButtons = (
      <ButtonGroup className="inline m-r-5">
        <Button onClick={this.startQuery} disabled={!(this.props.queryEditor.dbId)}>
          <i className="fa fa-table"/> Run
        </Button>
        <Button onClick={this.notImpemented} disabled={!(this.props.queryEditor.dbId)}>
          <i className="fa fa-line-chart"/> Visualize
        </Button>
      </ButtonGroup>
    );
    if (this.props.latestQuery && this.props.latestQuery.state == 'running') {
      runButtons = (
      <ButtonGroup className="inline m-r-5">
        <Button onClick={this.stopQuery}>
          <a className="fa fa-stop"/> Stop
        </Button>
      </ButtonGroup>);
    }
    var rightButtons = (
      <ButtonGroup className="inlineblock">
        <ButtonWithTooltip
            tooltip="Save this query in your workspace"
            placement="left"
            onClick={this.addWorkspaceQuery}>
          <i className="fa fa-save"/>&nbsp;
        </ButtonWithTooltip>
        <DropdownButton pullRight title={<i className="fa fa-file-o"/>}>
          <MenuItem
              onClick={this.notImplemented}>
            <i className="fa fa-file-text-o"/> export to .csv
          </MenuItem>
          <MenuItem
              onClick={this.notImplemented}>
            <i className="fa fa-file-code-o"/> export to .json
          </MenuItem>
        </DropdownButton>

      </ButtonGroup>
    );
    return (
      <div className="SqlEditor">
        <div>
          <div>
            <AceEditor
              mode="sql"
              name={this.props.name}
              theme="github"
              minLines={5}
              maxLines={30}
              onChange={this.textChange}
              height="200px"
              width="100%"
              editorProps={{$blockScrolling: true}}
              enableBasicAutocompletion={true}
              value={this.state.sql}/>
            <div className="clearfix sql-toolbar padded">
              <div className="pull-left">
                {runButtons}
                <div className="inlineblock m-r-5">
                  <Select
                    name="select-db"
                    placeholder="[Database]"
                    options={this.state.databaseOptions}
                    value={this.props.queryEditor.dbId}
                    autosize={false}
                    onChange={this.changeDb}
                  />
                </div>
                <span className="inlineblock valignTop" style={{ height: '20px' }}>
                  <input type="text" className="form-control" placeholder="CREATE TABLE AS"/>
                </span>
              </div>
              <div className="pull-right">
                <Timer query={this.props.latestQuery} />
                {rightButtons}
              </div>
            </div>
            <div className="padded">
              <SouthPane latestQuery={this.props.latestQuery} sqlEditor={this} />
            </div>
          </div>
        </div>
      </div>
    )
  }
});

function mapStateToProps(state) {
  return {
    queries: state.queries
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SqlEditor)
