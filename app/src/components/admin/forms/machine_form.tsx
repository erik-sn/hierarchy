
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { IFormValues, IMachine, IModule, IReduxState, ISite } from '../../../constants/interfaces';

import { renderCheckbox, renderNullField, renderTextField } from '../../../utils/form_renderer';
import ModuleEdit from './module_edit';


export interface IMachineFormProps {
  change?: (key: string, value: any) => void;  // redux-form
  cancel?: () => void;
  submitForm: (form: {}) => void;
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;  // redux-form
  machine?: IMachine;
  modules?: IModule[];
}

interface IMachineFormErrors { name?: string; type?: string; }


/**
 * form component to handle CRUD operations on Machine objects
 * 
 * @class MachineForm
 * @extends {React.Component<IMachineFormProps, {}>}
 */
export class MachineForm extends React.Component<IMachineFormProps, {}> {

  constructor(props: IMachineFormProps) {
    super(props);
    this.clearForm = this.clearForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
  }

  /**
   * Set the form back to all default values
   *
   * @memberOf MachineForm
   */
  public clearForm(): void {
    const { change } = this.props;
    change('name', '');
    change('type', '');
    change('defaultModule', undefined);
    change('active', false);
  }

  /**
   * actions to take when the cancel button is clicked
   *
   * @memberOf MachineForm
   */
  public cancelForm(): void {
    this.props.cancel();
  }

  /**
   * helper method to clean JSX, generate ModuleEdit interface
   *
   * @returns {JSX.Element}
   *
   * @memberOf MachineForm
   */
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


  /**
   * helper method to clean JSX, generate cancel button
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf MachineForm
   */
  public renderCancelButton(): JSX.Element {
    return (
      <FlatButton
        label="Cancel"
        onClick={this.cancelForm}
        primary
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
          {machine ? this.renderCancelButton() : undefined}
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


// Decorate the form component
const MachineFormDecorated = reduxForm({
  form: 'machine_form',
})(MachineForm);

export default connect<{}, {}, IMachineFormProps>(mapStateToProps)(MachineFormDecorated);
