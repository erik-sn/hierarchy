
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';

import { IMachine, IModule, ISite } from '../../../constants/interfaces';
import ModuleEdit from './admin_module_edit';

export interface IMachineFormProps {
  submitForm: (machine: IMachine) => void;
  machine?: IMachine;
  modules?: number[];
  cancel: () => void;
}

export interface IMachineFormState {
  name: string;
  type: string;
  active: boolean;
}


class MachineForm extends React.Component<IMachineFormProps, IMachine> {

  constructor(props: IMachineFormProps) {
    super(props);
    // if a machine is specified the form is in update mode, so set initial values
    // accordingto the input machine
    const machine = props.machine;
    this.state = {
      id: machine ?  machine.id : null,
      name: machine ? machine.name : '',
      type: machine ? machine.type : '',
      active: machine ? machine.active : true,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleActiveChange = this.handleActiveChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  public clearForm(): void {
    this.setState({
      name: '',
      type: '',
      active: true,
    });
  }

  public submitForm(): void {
    this.props.submitForm(this.state);
    this.clearForm();
  }

  public handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    this.setState({ name: event.currentTarget.value });
  }

  public handleTypeChange(event: React.FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    this.setState({ type: event.currentTarget.value });
  }

  public handleActiveChange(event: React.MouseEvent<{}>, checked: boolean): void {
    event.preventDefault();
    this.setState({ active: !this.state.active });
  }

  public render(): JSX.Element {
    return (
      <div className="admin__machine-container">
        <div className="mui-form-component">
          <TextField
            name="name"
            hintText="Name"
            floatingLabelText="Name"
            onChange={this.handleNameChange}
            value={this.state.name}
          />
        </div>
        <div className="mui-form-component">
          <TextField
            name="type"
            hintText="Type"
            floatingLabelText="Type"
            onChange={this.handleTypeChange}
            value={this.state.type}
          />
        </div>
        <div className="mui-form-component">
          <Checkbox
            label="Active"
            onCheck={this.handleActiveChange}
            checked={this.state.active}
          />
        </div>
        <div className="admin__lower-form-section">
          <FlatButton
            label={this.props.machine ? 'Update' : 'Create'}
            onClick={this.submitForm}
            keyboardFocused
            primary
          />
          <FlatButton
            label="Clear"
            onClick={this.clearForm}
            primary
          />
          <FlatButton
            label="Cancel"
            onClick={this.props.cancel}
            primary
          />
        </div>
      </div>
    );
  }
}

export default MachineForm;
