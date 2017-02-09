import { expect } from 'chai';
import { ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';
import * as React from 'react';
import * as sinon from 'sinon';

import { renderCheckbox as Checkbox, IDateProps, IFieldProps, renderDateField,
  renderRadioGroup, renderSelect, renderTextArea, renderTextField,
  renderTimeField } from '../../src/utils/form_renderer';
import { mountWithTheme } from '../helper';

describe('Form Renderer | ', () => {
  let component: ShallowWrapper<{}, {}>;
  describe('renderDateField | >>>', () => {
    let onChange: sinon.SinonSpy;
    const props: IDateProps<Date> = {
      input: {
        value: new Date(),
        onChange: undefined, // set as spy in beforeEach
      },
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
    let onChange: sinon.SinonSpy;
    const props: IDateProps<Date> = {
      input: {
        value: new Date(),
        onChange: undefined, // set as spy in beforeEach
      },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderTimeField(props);
      component = shallow(Element);
    });

    it('Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('TimePicker')).to.have.length(1);
    });

    it('Renders correct form component', () => {
      component.find('TimePicker').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderTextField | >>>', () => {
    let onChange: sinon.SinonSpy;
    const props: IFieldProps = {
      input: {
        value: 'test value',
        onChange: undefined, // set as spy in beforeEach
      },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderTextField(props);
      component = shallow(Element);
    });

    it('Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('TextField')).to.have.length(1);
    });

    it('Renders correct form component', () => {
      component.find('TextField').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderTextArea | >>>', () => {
    let onChange: sinon.SinonSpy;
    const props: IFieldProps = {
      input: {
        value: 'test value',
        onChange: undefined, // set as spy in beforeEach
      },
      label: 'test label',
      meta: { touched: true, error: true },
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderTextArea(props);
      component = shallow(Element);
    });

    it('Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('TextField')).to.have.length(1);
    });

    it('Renders correct form component', () => {
      component.find('TextField').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderCheckbox | >>>', () => {
    let checkbox: ShallowWrapper<{}, {}>;
    const onChange: sinon.SinonSpy = sinon.spy();
    const props = {
      input: { checked: true, onChange },
      label: 'test label',
    };

    beforeEach(() => {
      checkbox = shallow(<Checkbox {...props}  />);
    });

    it('Renders correct form component', () => {
      expect(checkbox.find('Checkbox')).to.have.length(1);
      expect(checkbox.find('Checkbox').props().checked).to.be.true;
      checkbox.find('Checkbox').simulate('check');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describe('renderRadioGroup | >>>', () => {
    let mountedComponent: ReactWrapper<{}, {}>;
    let onChange;
    const children = [
      <RadioButton key={1} value="test1" />,
      <RadioButton key={2} value="test2" />,
    ];
    const props: IFieldProps = {
      input: {
        value: 'test1',
        onChange: undefined,
      },
      label: 'test label',
      meta: { touched: true, error: true },
      children,
    };

    beforeEach(() => {
      onChange = sinon.spy();
      props.input.onChange = onChange;
      const Element = renderRadioGroup(props);
      mountedComponent = mountWithTheme(Element);
    });

    it('Renders correct form component', () => {
      expect(mountedComponent.find('.mui-form-component')).to.have.length(1);
      expect(mountedComponent.find('RadioButtonGroup')).to.have.length(1);
    });
  });

  describe('renderSelectField | >>>', () => {
    let onChange: sinon.SinonSpy;
    const children = [
      <MenuItem key={1} primaryText="test1" />,
      <MenuItem key={2} primaryText="test2" />,
      <MenuItem key={3} primaryText="test3" />,
      <MenuItem key={4} primaryText="test4" />,
    ];
    const props: IFieldProps = {
      input: {
        value: 'test value',
        onChange: undefined,
      },
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

    it('Renders correct form component', () => {
      expect(component.find('.mui-form-component')).to.have.length(1);
      expect(component.find('SelectField')).to.have.length(1);
      expect(component.find('MenuItem')).to.have.length(4);
    });

    it('Renders correct form component', () => {
      component.find('SelectField').simulate('change');
      expect(onChange.callCount).to.equal(1);
    });
  });
});
