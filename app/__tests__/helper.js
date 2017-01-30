
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import { Provider } from 'react-redux';
import jsdom from 'jsdom';
import chai from 'chai';
import { mount } from 'enzyme';
import dirtyChai from 'dirty-chai';
import chaiImmutable from 'chai-immutable';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import reducers from '../src/reducers';

chai.use(dirtyChai);
chai.use(chaiImmutable);


global.document = jsdom.jsdom('<!doctype html><html><body><div id="root" /></body></html>');
global.window = global.document.defaultView;

global.navigator = {
  userAgent: 'node.js',
};

// necessary for promise resolution
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

export function reduxWrap(component) {
  return (
    <Provider store={store}>
      {component}
    </Provider>
  );
}

export function mountWithTheme(component) {
  return mount((
    <MuiThemeProvider>
      {component}
    </MuiThemeProvider>
  ));
}

function storageMock() {
  const storage = {};

  return {
    setItem(key, value) {
      storage[key] = value || '';
    },
    getItem(key) {
      return storage[key] || null;
    },
    removeItem(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
}

export function triggerResize() {
  const evt = window.document.createEvent('UIEvents'); 
  evt.initUIEvent('resize', true, false, window, 0); 
  window.dispatchEvent(evt);
}


window.localStorage = storageMock();
