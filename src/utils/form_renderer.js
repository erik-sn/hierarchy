import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import TimePicker from 'material-ui/TimePicker';

export const renderDateField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <div className="mui-form-component">
    <DatePicker
      mode="landscape"
      onChange={(event, date) => input.onChange(date)}
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      value={input.value}
      {...custom}
    />
  </div>
);

renderDateField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string
  fetchHierarchy: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired,
};

export const renderTimeField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <div className="mui-form-component">
    <TimePicker
      format="ampm"
      onChange={(event, date) => input.onChange(date)}
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      value={input.value}
      {...custom}
    />
  </div>
);

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <div className="mui-form-component">
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
  </div>
);

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) => (
  <div className="mui-form-component">
    <TextField
      style={{ width: '100%' }}
      multiLine
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
  </div>
);

export class renderCheckbox extends Component {

  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
  }

  onCheck(e, checked) {
    this.props.input.onChange(checked);
  }

  render() {
    return (
      <Checkbox
        {...this.props.input}
        label={this.props.label}
        checked={this.props.input.checked}
        onCheck={this.onCheck}
      />
    );
  }
}

export const renderSelect = ({ input, label, meta, children }) => (
  <div className="mui-form-component">
    <SelectField
      floatingLabelText={label}
      errorText={meta.touched && meta.error}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
    >
      {children}
    </SelectField>
  </div>
);

export const renderRadioGroup = ({ input, children }) => (
  <div className="mui-form-component">
    <RadioButtonGroup
      {...input}
      valueSelected={input.value}
      onChange={(event, value) => input.onChange(value)}
    >
      {children}
    </RadioButtonGroup>
  </div>
);

export const renderNullField = ({ input }) => (
  <div className="mui-form-component hidden">
    <TextField
      style={{ display: 'none' }}
      {...input}
    />
  </div>
);
