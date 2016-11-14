import React from 'react';
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

export const renderCheckbox = ({ input, label }) => (
  <Checkbox
    label={label}
    checked={input.value}
    onCheck={input.onChange}
  />
);

export const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup
    {...input}
    {...rest}
    valueSelected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

export const renderSelect = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <div className="mui-form-component">
    <SelectField
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
      {...custom}
    >
      {children}
    </SelectField>
  </div>
);
