var $ = window.$ = require('jquery');
var jQuery = window.jQuery = $;
require('bootstrap');

import React from 'react';
import { render } from 'react-dom';

import SplitPane from 'react-split-pane'

import Workspace from './components/Workspace'
import TabbedSqlEditors from './components/TabbedSqlEditors'

import { compose, createStore } from 'redux'
import { Provider } from 'react-redux';

import sqlAnvilReducer from './reducers'
import persistState from 'redux-localstorage'
import shortid from 'shortid';

require('./main.css')
const enhancer = compose(
  persistState()
);

var qe = {
  id: shortid.generate(),
  title: "Query 1",
  sql: "SELECT *\nFROM\nWHERE",
  latestQueryId: null,
  autorun: false,
  dbId: null,
};

const initialState = {
  queryEditors: [qe],
  queries: [],
  tables: [],
  workspaceQueries: [],
  tabHistory: [qe.id],
  workspaceDatabase: null,
};

let store = createStore(sqlAnvilReducer, initialState, enhancer);

const App = React.createClass({
  render: function () {
    return (
      <div className="App SqlAnvil">
        <SplitPane split="vertical" minSize={200} defaultSize={300}>
          <div className="pane-cell pane-west">
            <Workspace/>
          </div>
          <div className="pane-cell">
            <TabbedSqlEditors/>
          </div>
        </SplitPane>
      </div>
    )
  }
});

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
