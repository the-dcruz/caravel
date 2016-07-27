var $ = window.$ = require('jquery');
var jQuery = window.jQuery = $;
require('bootstrap');

import React from 'react';
import { render } from 'react-dom';

import SplitPane from 'react-split-pane'

import Workspace from './components/Workspace'
import TabbedSqlEditors from './components/TabbedSqlEditors'

import { createStore } from 'redux'
import { Provider } from 'react-redux';

import sqlAnvilReducer from './reducers'

require('./main.css')

let store = createStore(sqlAnvilReducer);

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
