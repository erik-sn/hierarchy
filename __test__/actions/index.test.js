import React from 'react';
import { expect } from 'chai';
import moxios from 'moxios';
import { shallow } from 'enzyme';

import * as actions from '../../src/actions/index';
import types from '../../src/actions/types';

describe('index.test.js (Actions)', () => {
  describe('Auth Actions | >>>', () => {
    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('1. Should generate the correct action for fetchAuth', () => {
      moxios.withMock(() => {
        const action = actions.fetchAuth();
        expect(action.type).to.equal(types.FETCH_AUTH);
        expect(action.payload).to.be.a('promise');
      });
    });

    it('2. Should generate the correct action for fetchHierachy', () => {
      moxios.withMock(() => {
        const action = actions.fetchHierarchy();
        expect(action.type).to.equal(types.FETCH_HIERARCHY);
        expect(action.payload).to.be.a('promise');
      });
    });
  });


  describe('Modal Actions | >>>', () => {

    it('1. Should generate the correct action for showModal', () => {
      const child = <h1>Test Child!</h1>;
      const action = actions.showModal('test title', 'test message', child);
      expect(action.type).to.equal(types.SHOW_MODAL);
      expect(action.payload.showModal).to.equal(true);
      expect(action.payload.component.$$typeof).to.exist();
    });

    it('2. Should generate the correct response if no child is specified', () => {
      const action = actions.showModal('test title', 'test message');
      expect(action.type).to.equal(types.SHOW_MODAL);
      expect(action.payload.showModal).to.equal(true);
      expect(action.payload.component.$$typeof).to.exist();
    });

    it('3. Should generate the correct action for hideModal', () => {
      const action = actions.hideModal();
      expect(action.type).to.equal(types.HIDE_MODAL);
      expect(action.payload.showModal).to.equal(false);
    });
  });
});
