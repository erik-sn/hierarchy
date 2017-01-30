import { expect } from 'chai';
import moxios from 'moxios';

import * as actions from '../../src/actions/api';
import types from '../../src/actions/types';

describe('api.test.js (Actions)', () => {
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
});
