
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { IMachine, IModule, IReduxState, ISite } from '../../../constants/interfaces';

import { renderCheckbox, renderNullField, renderTextField } from '../../../utils/form_renderer';
import ModuleEdit from './admin_module_edit';


export interface IMachineFormProps {
  change?: (key: string, value: any) => void;
  cancel?: () => void;
  submitForm: (form: {}) => void;
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  machine?: IMachine;
  modules?: IModule[];
}

interface IFormValues { initialValues: IMachine; }

interface IMachineFormErrors { name?: string; type?: string; }


class MachineForm extends React.Component<IMachineFormProps, {}> {

  constructor(props: IMachineFormProps) {
    super(props);
    this.clearForm = this.clearForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
  }

  public clearForm(): void {
    const { change } = this.props;
    change('name', '');
    change('type', '');
    change('active', false);
  }

  public cancelForm(): void {
    this.props.cancel();
  }

  public renderModuleEdit(): JSX.Element {
    const { machine, modules, change } = this.props;
    return (
      <ModuleEdit
        parentObject={machine}
        modules={modules}
        change={change}
      />
    );
  }

  public render() {
    const { handleSubmit, submitForm, machine }: IMachineFormProps = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <div className="admin__machine-container">
          <Field
            className="admin__form-field"
            name="defaultModule"
            component={renderNullField}
            label="Default Module"
          />
          <Field className="admin__form-field" name="name" component={renderTextField} label="Name" />
          <Field className="admin__form-field" name="type" component={renderTextField} label="Type" />
          <div style={{ width: '100%', height: '20px' }} />
          <Field
            className="admin__form-field"
            name="active"
            type="checkbox"
            component={renderCheckbox}
            label="Active"
          />
          <div style={{ width: '100%', height: '20px' }} />
        </div>
        <div className="admin__form-section" >
          {machine ? this.renderModuleEdit() : ''}
        </div>
        <div className="admin__lower-form-section">
          <FlatButton
            label={machine ? 'Update' : 'Create'}
            type="submit"
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
            onClick={this.cancelForm}
            primary
          />
        </div>
      </form>
    );
  }
}


/**
 * Initialize the form state. If a machine was passed through props then
 * set that machine into the form. Otherwise use a default configuration
 */
function mapStateToProps(state: IReduxState, ownProps: IMachineFormProps): IFormValues {
  if (ownProps.machine) {
    return {initialValues: ownProps.machine};
  }
  return { initialValues: { active: true, modules: [], name: '', type: '' } };
}


export const validate = (machineForm: IMachine) => {
  const errors: IMachineFormErrors = {};
  if (!machineForm.name) {
    errors.name = 'Required';
  } else if (!machineForm.name.match(/^[a-zA-Z0-9 ]+$/)) {
    errors.name = 'Name can only contain letters and numbers';
  }
  if (!machineForm.type) {
    errors.type = 'Required';
  } else if (!machineForm.type.match(/^[a-zA-Z0-9 ]+$/)) {
    errors.type = 'Type can only contain letters and numbers';
  }
  return errors;
};


// Decorate the form component
const MachineFormDecorated = reduxForm({
  form: 'machine_form',
})(MachineForm);

export default connect<{}, {}, IMachineFormProps>(mapStateToProps)(MachineFormDecorated);

// export interface IMachineFormProps {
//   submitForm: (machine: IMachine) => void;
//   machine?: IMachine;
//   modules?: number[];
//   cancel: () => void;
// }

// interface IMachineFormError {
//   name?: string;
//   type?: string;
// }

// export interface IMachineFormState {
//   id: number;
//   name: string;
//   type: string;
//   active: boolean;
//   error: IMachineFormError;
// }

// function validate(machineForm: IMachine): IMachineFormError {
//   const errors: IMachineFormError = {};
//   if (!machineForm.name) {
//     errors.name = 'Required';
//   } else if (!machineForm.name.match(/^[a-zA-Z0-9 ]+$/)) {
//     errors.name = 'Name can only contain letters and numbers';
//   }
//   if (!machineForm.name) {
//     errors.type = 'Required';
//   } else if (!machineForm.name.match(/^[a-zA-Z0-9 ]+$/)) {
//     errors.type = 'Type can only contain letters and numbers';
//   }
//   return errors;
// }


// class MachineForm extends React.Component<IMachineFormProps, IMachineFormState> {

//   constructor(props: IMachineFormProps) {
//     super(props);
//     // if a machine is specified the form is in update mode, so set initial values
//     // accordingto the input machine
//     const machine = props.machine;
//     this.state = {
//       id: machine ?  machine.id : null,
//       name: machine ? machine.name : '',
//       type: machine ? machine.type : '',
//       active: machine ? machine.active : true,
//       error: {},
//     };
//     this.handleNameChange = this.handleNameChange.bind(this);
//     this.handleTypeChange = this.handleTypeChange.bind(this);
//     this.handleActiveChange = this.handleActiveChange.bind(this);
//     this.clearForm = this.clearForm.bind(this);
//     this.submitForm = this.submitForm.bind(this);
//   }

//   public clearForm(): void {
//     this.setState({
//       id: null,
//       name: '',
//       type: '',
//       active: true,
//       error: {},
//     });
//   }

//   public submitForm(): void {
//     const error: IMachineFormError = validate(this.state);
//     if (Object.keys(error).length === 0) {
//       this.props.submitForm(this.state);
//       this.clearForm();
//     } else {
//       this.setState({ error });
//     }
//   }

//   public handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
//     event.preventDefault();
//     this.setState({ name: event.currentTarget.value });
//   }

//   public handleTypeChange(event: React.FormEvent<HTMLInputElement>): void {
//     event.preventDefault();
//     this.setState({ type: event.currentTarget.value });
//   }

//   public handleActiveChange(event: React.MouseEvent<{}>, checked: boolean): void {
//     event.preventDefault();
//     this.setState({ active: !this.state.active });
//   }

//   public render(): JSX.Element {
//     return (
//       <div className="admin__machine-container">
//         <div className="mui-form-component">
//           <TextField
//             name="name"
//             hintText="Name"
//             floatingLabelText="Name"
//             onChange={this.handleNameChange}
//             value={this.state.name}
//           />
//         </div>
//         <div className="mui-form-component">
//           <TextField
//             name="type"
//             hintText="Type"
//             floatingLabelText="Type"
//             onChange={this.handleTypeChange}
//             value={this.state.type}
//           />
//         </div>
//         <div className="mui-form-component">
//           <Checkbox
//             label="Active"
//             onCheck={this.handleActiveChange}
//             checked={this.state.active}
//           />
//         </div>
//         <div className="admin__lower-form-section">
//           <FlatButton
//             label={this.props.machine ? 'Update' : 'Create'}
//             onClick={this.submitForm}
//             keyboardFocused
//             primary
//           />
//           <FlatButton
//             label="Clear"
//             onClick={this.clearForm}
//             primary
//           />
//           <FlatButton
//             label="Cancel"
//             onClick={this.props.cancel}
//             primary
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default MachineForm;
