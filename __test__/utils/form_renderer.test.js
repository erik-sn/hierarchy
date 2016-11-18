import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';

import { mountWithTheme } from '../helper';
import { renderDateField, renderTimeField, renderTextField, renderTextArea,
  renderCheckbox, renderRadioGroup, renderSelect } from '../../src/utils/form_renderer';

describe('Form Renderer | ', () => {
  let component;
  describe('renderDateField | >>>', () => {
    let onChange;
    const props = {
      input: { value: 'test value' },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderDateField(props);
      component = shallow(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('DatePicker')).to.have.length(1);
    });

    it('2. Renders correct form component', () => {
      component.find('DatePicker').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderTimeField | >>>', () => {
    let onChange;
    const props = {
      input: { value: 'test value' },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderTimeField(props);
      component = shallow(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('TimePicker')).to.have.length(1);
    });

    it('2. Renders correct form component', () => {
      component.find('TimePicker').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderTextField | >>>', () => {
    let onChange;
    const props = {
      input: { value: 'test value' },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderTextField(props);
      component = shallow(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('TextField')).to.have.length(1);
    });

    it('2. Renders correct form component', () => {
      component.find('TextField').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderTextArea | >>>', () => {
    let onChange;
    const props = {
      input: { value: 'test value' },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderTextArea(props);
      component = shallow(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('TextField')).to.have.length(1);
    });

    it('2. Renders correct form component', () => {
      component.find('TextField').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderCheckbox | >>>', () => {
    let onChange;
    const props = {
      input: { value: true },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onCheck = onChange;
      const Element = renderCheckbox(props);
      component = mountWithTheme(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('Checkbox')).to.have.length(1);
    });
  });

  describe('renderRadioGroup | >>>', () => {
    let onChange;
    const children = [
      <RadioButton key={1} value="test1" />,
      <RadioButton key={2} value="test2" />,
    ];
    const props = {
      input: { value: 'test1' },
      label: 'test label',
      meta: { touched: true, error: true },
      children,
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderRadioGroup(props);
      component = mountWithTheme(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('RadioButtonGroup')).to.have.length(1);
    });
  });

  describe('renderSelectField | >>>', () => {
    let onChange;
    const children = [
      <MenuItem key={1} primaryText="test1" />,
      <MenuItem key={2} primaryText="test2" />,
      <MenuItem key={3} primaryText="test3" />,
      <MenuItem key={4} primaryText="test4" />,
    ];
    const props = {
      input: { value: 'test value' },
      label: 'test label',
      meta: { touched: true, error: true },
      children,
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderSelect(props);
      component = shallow(Element);
    });

    it('1. Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(4);
    });

    it('2. Renders correct form component', () => {
      component.find('SelectField').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });
});
