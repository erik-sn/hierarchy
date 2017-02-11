import { expect } from 'chai';

const moxios = require('moxios');

import * as actions from '../../src/actions/api';
import types from '../../src/actions/types';
import { IAction } from '../../src/constants/interfaces';

describe('api.test.js (Actions)', () => {
  describe('Auth Actions | >>>', () => {
    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('Should generate the correct action for fetchAuth', () => {
      moxios.withMock(() => {
        const action: IAction = actions.fetchAuth();
        expect(action.type).to.equal(types.FETCH_AUTH);
        expect(action.payload).to.be.a('promise');
      });
    });

    it('Should generate the correct action for fetchHierachy', () => {
      moxios.withMock(() => {
        const action: IAction = actions.fetchHierarchy();
        expect(action.type).to.equal(types.FETCH_HIERARCHY);
        expect(action.payload).to.be.a('promise');
      });
    });
  });
});
