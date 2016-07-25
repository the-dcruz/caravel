import React, { PropTypes } from 'react'
import { Alert, Button, ButtonGroup } from 'react-bootstrap'
import Link from './Link'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import shortid from 'shortid'

// CSS
import 'react-select/dist/react-select.css';

const QueryWorkspaceElement = React.createClass({
  popTab: function () {
    var qe = {
      id: shortid.generate(),
      title: this.props.query.title,
      dbId: this.props.query.dbId,
      autorun: false,
      sql: this.props.query.sql,
    };
    this.props.actions.addQueryEditor(qe);
  },
  render: function () {
    var metadata = null;
    return (
      <div className="ws-el">
        {this.props.query.title}
        <ButtonGroup className="ws-el-controls pull-right">
          <Link
              className="fa fa-play"
              onClick={this.popTab}
              tooltip="Run query in a new tab"
              href="#"
          />
        </ButtonGroup>
      </div>
    )
  }
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}
export default connect(null, mapDispatchToProps)(QueryWorkspaceElement)

