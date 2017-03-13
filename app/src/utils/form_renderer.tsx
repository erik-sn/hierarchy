import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import * as React from 'react';

export interface IDateInput<T> {
  value: T;
  onChange: (value: T) => void;
}

export interface IDateProps<T> {
  input: IDateInput<T>;
  label: string;
  meta: any;
}

export interface IInputField {
  value: string;
  onChange: any;
}

export interface IFieldProps {
  input: IInputField;
  label?: string;
  meta?: any;
  children?: JSX.Element[];
}

export const renderDateField = ({ input, label, meta: { touched, error },
                                ...custom }: IDateProps<Date>): JSX.Element => {
  const handleOnChange = (event: React.FormEvent<HTMLInputElement>, date: Date) => input.onChange(date);
  return (
    <div className="mui-form-component">
      <DatePicker
        mode="landscape"
        onChange={handleOnChange}
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        value={input.value}
        {...custom}
      />
    </div>
  );
};

export const renderTimeField = ({ input, label, meta: { touched, error },
                                ...custom }: IDateProps<Date>): JSX.Element => {
  const handleOnChange = (event: React.FormEvent<HTMLInputElement>, date: Date) => input.onChange(date);
  return (
    <div className="mui-form-component">
      <TimePicker
        format="ampm"
        onChange={handleOnChange}
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        value={input.value}
        {...custom}
      />
    </div>
  );
};

export const renderTextField = ({ input, label, meta: { touched, error },
                                ...custom }: IFieldProps): JSX.Element => {
  return (
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
};

export const renderTextArea = ({ input, label, meta: { touched, error },
                                ...custom }: IFieldProps): JSX.Element => (
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

interface ICheckboxInput {
  checked: boolean;
  onChange: any;
}
export interface ICheckboxProps {
  input: ICheckboxInput;
  label: string;
}

export class RenderCheckbox extends React.Component<ICheckboxProps, {}> {

  constructor(props: ICheckboxProps) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
  }

  public onCheck(event: React.MouseEvent<{}>, checked: boolean): void {
    this.props.input.onChange(checked);
  }

  public render(): JSX.Element {
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

export const renderSelect = ({ input, label, meta, children }: IFieldProps): JSX.Element => {
  const handleOnChange = (event: any, value: any) => input.onChange(value);
  return (
    <div className="mui-form-component">
      <SelectField
        floatingLabelText={label}
        errorText={meta.touched && meta.error}
        {...input}
        onChange={handleOnChange}
      >
        {children}
      </SelectField>
    </div>
  );
};

export const renderRadioGroup = ({ input, children }: IFieldProps): JSX.Element => {
  const handleOnChange = (event: React.FormEvent<HTMLInputElement>, value: string) => input.onChange(value);
  return (
    <div className="mui-form-component">
      <RadioButtonGroup
        {...input}
        name="mui-radio"
        valueSelected={input.value}
        onChange={handleOnChange}
      >
        {children}
      </RadioButtonGroup>
    </div>
  );
};

export const renderNullField = ({ input }: IFieldProps): JSX.Element => (
  <div className="mui-form-component hidden">
    <TextField
      style={{ display: 'none' }}
      {...input}
    />
  </div>
);
