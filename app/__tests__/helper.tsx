import * as chai from 'chai';
import { mount, ReactWrapper } from 'enzyme';
import * as enzyme from 'enzyme';
import * as jsdom from 'jsdom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import * as promise from 'redux-promise';

import { IDictionary } from '../src/constants/interfaces';

import reducers from '../src/reducers';

// jsdom configuration
declare const global: any;
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const window = doc.defaultView;
global['document'] = doc;
global['window'] = window;
global['window'].localStorage = storageMock();
global['navigator'] = {userAgent: 'node.js'};
global['HTMLElement'] = global['window'].HTMLElement;


// necessary for promise resolution
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

export function reduxWrap(component: JSX.Element): JSX.Element {
  return (
    <Provider store={store}>
      {component}
    </Provider>
  );
}

export function mountWithTheme(component: JSX.Element, props?: any): ReactWrapper<{}, {}> {
  return mount(
    <MuiThemeProvider>
      {component}
    </MuiThemeProvider>,
  );
}


function storageMock(): Object {
  const storage: IDictionary<string> = {};
  return {
    setItem(key: string, value: string) {
      storage[key] = value || '';
    },
    getItem(key: string) {
      return storage[key] || null;
    },
    removeItem(key: string) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i: number) {
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
