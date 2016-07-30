import moment from 'moment';
import * as actions from './actions';

function alterInArr(state, arrKey, obj, alterations) {
  // Finds an item in an array in the state and replaces it with a
  // new object with an altered property
  const idKey = 'id';
  const newArr = [];
  state[arrKey].forEach((arrItem) => {
    if (obj[idKey] === arrItem[idKey]) {
      newArr.push(Object.assign({}, arrItem, alterations));
    } else {
      newArr.push(arrItem);
    }
  });
  return Object.assign({}, state, { [arrKey]: newArr });
}

function removeFromArr(state, arrKey, obj, idKey = 'id') {
  const newArr = [];
  state[arrKey].forEach((arrItem) => {
    if (!(obj[idKey] === arrItem[idKey])) {
      newArr.push(arrItem);
    }
  });
  return Object.assign({}, state, { [arrKey]: newArr });
}

function addToArr(state, arrKey, obj) {
  const newState = {};
  newState[arrKey] = [...state[arrKey], Object.assign({}, obj)];
  return Object.assign({}, state, newState);
}

function sqlAnvilReducer(state, action) {
  const actionHandlers = {
    [actions.ADD_QUERY_EDITOR]() {
      const tabHistory = state.tabHistory.slice();
      tabHistory.push(action.queryEditor.id);
      const newState = Object.assign({}, state, { tabHistory });
      return addToArr(newState, 'queryEditors', action.queryEditor);
    },
    [actions.REMOVE_QUERY_EDITOR]() {
      let newState = removeFromArr(state, 'queryEditors', action.queryEditor);
      // List of remaining queryEditor ids
      const qeIds = newState.queryEditors.map((qe) => qe.id);
      let th = state.tabHistory.slice();
      th = th.filter((id) => qeIds.includes(id));
      newState = Object.assign({}, newState, { tabHistory: th });
      return newState;
    },
    [actions.REMOVE_QUERY]() {
      return removeFromArr(state, 'queries', action.query);
    },
    [actions.ADD_TABLE]() {
      return addToArr(state, 'tables', action.table);
    },
    [actions.EXPAND_TABLE]() {
      return alterInArr(state, 'tables', action.table, { expanded: true });
    },
    [actions.COLLAPSE_TABLE]() {
      return alterInArr(state, 'tables', action.table, { expanded: false });
    },
    [actions.REMOVE_TABLE]() {
      return removeFromArr(state, 'tables', action.table);
    },
    [actions.START_QUERY]() {
      const newState = addToArr(state, 'queries', action.query);
      const sqlEditor = { id: action.query.sqlEditorId };
      return alterInArr(newState, 'queryEditors', sqlEditor, { latestQueryId: action.query.id });
    },
    [actions.STOP_QUERY]() {
      return alterInArr(state, 'queries', action.query, { state: 'stopped' });
    },
    [actions.QUERY_SUCCESS]() {
      const alts = {
        state: 'success',
        results: action.results,
        rows: action.results.data.length,
        endDttm: moment(),
      };
      return alterInArr(state, 'queries', action.query, alts);
    },
    [actions.SET_WORKSPACE_DB]() {
      // Auto selecting database for queryEditors that don't have one yet
      let oneChanged = false;
      let newState = Object.assign({}, state);
      const queryEditors = state.queryEditors.map((qe) => {
        if (qe.dbId === null) {
          oneChanged = true;
          return Object.assign({}, qe, { dbId: action.db.id });
        }
        return qe;
      });
      if (oneChanged) {
        newState = Object.assign({}, newState, { queryEditors });
      }
      return Object.assign({}, newState, { workspaceDatabase: action.db });
    },
    [actions.QUERY_FAILED]() {
      const alts = { state: 'failed', msg: action.msg, endDttm: moment() };
      return alterInArr(state, 'queries', action.query, alts);
    },
    [actions.SET_ACTIVE_QUERY_EDITOR]() {
      const qeIds = state.queryEditors.map((qe) => qe.id);
      if (qeIds.includes(action.queryEditor.id)) {
        const tabHistory = state.tabHistory.slice();
        tabHistory.push(action.queryEditor.id);
        return Object.assign({}, state, { tabHistory });
      }
      return state;
    },
    [actions.QUERY_EDITOR_SETDB]() {
      return alterInArr(state, 'queryEditors', action.queryEditor, { dbId: action.dbId });
    },
    [actions.QUERY_EDITOR_SET_TITLE]() {
      return alterInArr(state, 'queryEditors', action.queryEditor, { title: action.title });
    },
    [actions.QUERY_EDITOR_SET_AUTORUN]() {
      return alterInArr(state, 'queryEditors', action.queryEditor, { autorun: action.autorun });
    },
    [actions.ADD_WORKSPACE_QUERY]() {
      return addToArr(state, 'workspaceQueries', action.query);
    },
    [actions.REMOVE_WORKSPACE_QUERY]() {
      return removeFromArr(state, 'workspaceQueries', action.query);
    },
  };
  if (action.type in actionHandlers) {
    return actionHandlers[action.type]();
  }
  return state;
}

export default sqlAnvilReducer;
