import { expect } from 'chai';
import { is, List } from 'immutable';

import { alphaNumSort } from '../../src/utils/sort';

describe('sort.test.js |', () => {
  describe('alphaNumSort | >>>', () => {
    const objects = ['OX21', 'OX11', 'AX15', 'OX15', 'OX12A', 'OX26', 'OX12B', 'AX17A'];
    const sorted = List(['AX15', 'AX17A', 'OX11', 'OX12A', 'OX12B', 'OX15', 'OX21', 'OX26']);
    it('1. correctly sorts by letters first and numbers second', () => {
      const sortedResult = List(objects.sort(alphaNumSort));
      expect(is(sortedResult, sorted)).to.equal(true);
    });

    it('2. returns 0 if values are equal', () => {
      expect(alphaNumSort('1', '1')).to.equal(0);
    });
  });
});
