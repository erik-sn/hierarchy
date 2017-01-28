import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import { IMachine, IModule, IReduxState, ISite } from '../../../constants/interfaces';
import { renderCheckbox as CheckBox, renderTextField as Text  } from '../../../utils/form_renderer';


export interface IModuleFormProps {
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  submitForm: (form: {}) => void;
  cancel?: () => void;
  change?: (key: string, value: any) => void;
  clear?: () => void;
  clean?: boolean;
  reset?: () => void;
  remove?: () => void;
  submitFailed?: boolean;
  module?: IModule;
}

export interface IModuleFormValidation {
  name?: string;
  label?: string;
}

export const FORM_NAME = 'MODULE-CONFIG';

class ModuleForm extends React.Component<IModuleFormProps, {}> {

  constructor(props: IModuleFormProps) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  public componentWillMount(): void {
    this.props.reset();
  }

  public componentWillUpdate(nextProps: IModuleFormProps) {
    const { module, change } = this.props;
    if (nextProps.module && module && nextProps.module.id !== module.id) {
      const updatedModule = nextProps.module;
      change('name', updatedModule.name);
      change('label', updatedModule.label);
      change('description', updatedModule.description);
      change('active', updatedModule.active);
    }
  }

  public handleDelete(): void {
    this.props.remove();
    this.props.reset();
  }

  public handleClear(): void {
    const { change } = this.props;
    change('name', '');
    change('label', '');
    change('description', '');
    change('active', true);
  }

  public renderCleanButtons(): JSX.Element {
    return (
      <FlatButton
        key={4}
        type="submit"
        label="Submit"
        primary
      />
    );
  }

  public renderUpdateButtons(): JSX.Element {
    return (
      <div>
        <FlatButton
          key={1}
          type="submit"
          label="Update"
          primary
        />
        <FlatButton
          key={2}
          onClick={this.handleDelete}
          label="Delete"
          primary
        />
      </div>
    );
  }

  public render(): JSX.Element {
    const { submitForm, handleSubmit, remove, clear, module,
            reset, submitFailed } = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <Field className="admin__form-field" name="name" component={Text} label="Name" />
        <Field className="admin__form-field" name="label" component={Text} label="Label" />
        <Field
          className="admin__form-field"
          name="description"
          component={Text}
          label="Description"
        />
        <div style={{ width: '100%', height: '20px' }} />
        <Field
          className="admin__form-field"
          name="active"
          type="checkbox"
          component={CheckBox}
          label="Active"
        />
        <div className="admin__form-container">
          <div className="admin__error-field">
            {submitFailed ? 'Error Submitting Form' : ''}
          </div>
        </div>
        {module ? this.renderUpdateButtons() : this.renderCleanButtons()}
        <FlatButton
          key={9}
          onClick={this.handleClear}
          label="Clear"
          primary
        />
      </form>
    );
  }
}


function mapStateToProps(state: IReduxState, ownProps: IModuleFormProps) {
  if (ownProps.module) {
    return { initialValues: ownProps.module };
  }
  return { initialValues: { active: true } };
}

export const validateOnSubmit = (formValues: IModuleFormValidation) => {
  const errors: IModuleFormValidation = {};
  if (!formValues.name) {
    throw new SubmissionError({ name: 'Name does not exixt' });
  }
  return errors;
};

export const validate = (formValues: IModuleFormValidation) => {
  const errors: IModuleFormValidation = {};
  if (!formValues.name) {
    errors.name = 'Required';
  }
  if (!formValues.label) {
    errors.label = 'Required';
  }
  return errors;
};

// Decorate the form component
const ModuleFormDecorated = reduxForm({
  form: FORM_NAME,
})(ModuleForm);

export default connect<{}, {}, IModuleFormProps>(mapStateToProps)(ModuleFormDecorated);

