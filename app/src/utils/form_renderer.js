import React, { Component, PropTypes } from 'react';
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
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
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

renderTimeField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
};

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

renderTextField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
};

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

renderTextArea.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
};

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

renderCheckbox.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
};

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

renderSelect.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  label: PropTypes.string,
};

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

renderRadioGroup.propTypes = {
  input: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

export const renderNullField = ({ input }) => (
  <div className="mui-form-component hidden">
    <TextField
      style={{ display: 'none' }}
      {...input}
    />
  </div>
);

renderNullField.propTypes = {
  input: PropTypes.object.isRequired,
};