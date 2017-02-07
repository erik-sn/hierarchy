import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import Row, { IRowProps } from '../../../../src/components/utility/filter_table/filter_table_row';
import { IDictionary } from '../../../../src/constants/interfaces';
import { mountWithTheme } from '../../../helper';


describe('filter_table_row.test.tsx |', () => {
  const defaultProps: IRowProps = {
    config: [
      {
        header: 'Name',
        label: 'name',
        width: 200,
        transform: undefined,
      },
      {
        header: 'Value',
        label: 'value',
        width: 300,
        transform: undefined,
      },
    ],
    rowData: {
      name: 'one',
      value: '1',
      classNames: {
        name: 'test_class',
      },
    },
    className: 'test_class',
    handleClick: undefined,
  };

  describe('default props', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Row {...defaultProps} handleClick={handleClick} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.filter_table__row').length).to.equal(1);
    });

    it('has two cells with the correct values', () => {
      expect(component.find('Cell').length).to.equal(2);

      const cell1Props: any = component.find('Cell').at(0).props();
      expect(cell1Props.value).to.equal('one');

      const cell2Props = component.find('Cell').at(1).props();
      expect(cell2Props.value).to.equal('1');
    });
  });

  describe('default props with no classnames', () => {
    let component: ShallowWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;
    const props: IRowProps = {
      config: [
        {
          header: 'Name',
          label: 'name',
          width: 200,
          transform: undefined,
        },
        {
          header: 'Value',
          label: 'value',
          width: 300,
          transform: undefined,
        },
      ],
      rowData: {
        name: 'one',
        value: '1',
      },
      handleClick: undefined,
    };

    beforeEach(() => {
      handleClick = sinon.spy();
      component = shallow(<Row {...props} handleClick={handleClick} />);
    });

    it('renders something & has correct containers', () => {
      expect(component).to.exist;
      expect(component.find('.filter_table__row').length).to.equal(1);
    });
  });

  describe('mounted with default props', () => {
    let component: ReactWrapper<{}, {}>;
    let handleClick: sinon.SinonSpy;

    beforeEach(() => {
      handleClick = sinon.spy();
      component = mountWithTheme(<Row {...defaultProps} handleClick={handleClick} />);
    });

    it('calls handleClick no cell click', () => {
      component.find('Cell').at(0).simulate('click');
      expect(handleClick.callCount).to.equal(1);
    });
  });

  describe('mounted with no handleCilck', () => {
    let component: ReactWrapper<{}, {}>;
    beforeEach(() => {
      component = mountWithTheme(<Row {...defaultProps} />);
    });

    it('does not error when handleClick is undefined and cell is clicked', () => {
      component.find('Cell').at(0).simulate('click');
    });
  });
});
