import { expect } from 'chai';
import * as React from 'react';

import * as actions from '../../src/actions/index';
import types from '../../src/actions/types';

describe('index.test.tsx (Actions)', () => {
  describe('Modal Actions | >>>', () => {
    it('Should generate the correct action for showModal', () => {
      const child = <h1>Test Child!</h1>;
      const action = actions.showModal('test title', 'test message', child);
      expect(action.type).to.equal(types.SHOW_MODAL);
      expect(action.payload.showModal).to.equal(true);
      expect(action.payload.component.$$typeof).to.exist;
    });

    it('Should generate the correct response if no child is specified', () => {
      const action = actions.showModal('test title', 'test message');
      expect(action.type).to.equal(types.SHOW_MODAL);
      expect(action.payload.showModal).to.equal(true);
      expect(action.payload.component.$$typeof).to.exist;
    });

    it('Should generate the correct action for hideModal', () => {
      const action = actions.hideModal();
      expect(action.type).to.equal(types.HIDE_MODAL);
      expect(action.payload.showModal).to.equal(false);
    });
  });
});
