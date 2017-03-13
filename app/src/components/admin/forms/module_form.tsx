import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import { IMachine, IModule, IReduxState, ISite } from '../../../constants/interfaces';
import { RenderCheckbox as CheckBox, renderTextField as Text  } from '../../../utils/form_renderer';

export interface IModuleFormProps {
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  submitForm: (form: {}) => void;
  change?: (key: string, value: any) => void;
  reset?: () => void;
  remove?: () => void;
  module?: IModule;
}

export interface IModuleFormValidation {
  name?: string;
  label?: string;
}

export const FORM_NAME = 'MODULE-CONFIG';

/**
 * Form component to handle CRUD operations on the Module object
 *
 * @class ModuleForm
 * @extends {React.Component<IModuleFormProps, {}>}
 */
export class ModuleForm extends React.Component<IModuleFormProps, {}> {

  constructor(props: IModuleFormProps) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  public componentWillMount(): void {
    this.props.reset();
  }

  public componentWillReceiveProps(nextProps: IModuleFormProps) {
    // if nextProps contains a module and it is different then the
    // current one, set it's values into the form.
    const { module, change } = this.props;
    if (nextProps.module && module && nextProps.module.id !== module.id) {
      const updatedModule = nextProps.module;
      change('name', updatedModule.name);
      change('label', updatedModule.label);
      change('description', updatedModule.description);
      change('active', updatedModule.active);
    }
  }

  /**
   * actions to take when delete is clicked
   *
   * @memberOf ModuleForm
   */
  public handleDelete(): void {
    this.props.remove();
    this.props.reset();
  }

  /**
   * set the form back to default values
   *
   * @memberOf ModuleForm
   */
  public handleClear(): void {
    const { change } = this.props;
    change('name', '');
    change('label', '');
    change('description', '');
    change('active', true);
  }

  /**
   * Buttons to render when the form is for creating
   * a new Module object.
   *
   * @returns {JSX.Element}
   *
   * @memberOf ModuleForm
   */
  public renderNewFormButtons(): JSX.Element {
    return (
      <FlatButton
        key={4}
        type="submit"
        label="Submit"
        primary
      />
    );
  }

  /**
   * Buttons to render when we are updating a module
   *
   * @returns {JSX.Element}
   *
   * @memberOf ModuleForm
   */
  public renderUpdateFormButtons(): JSX.Element {
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
    const { submitForm, handleSubmit, remove, module, reset } = this.props;
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
        {module ? this.renderUpdateFormButtons() : this.renderNewFormButtons()}
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

/**
 * Initialize the form from the passed module, or if that does not exist
 * do so from a set of default values.
 *
 * @param {IReduxState} state
 * @param {IModuleFormProps} ownProps
 * @returns
 */
function mapStateToProps(state: IReduxState, ownProps: IModuleFormProps) {
  if (ownProps.module) {
    return { initialValues: ownProps.module };
  }
  return { initialValues: { active: true } };
}

// Decorate the form component
const ModuleFormDecorated = reduxForm({
  form: FORM_NAME,
})(ModuleForm);

export default connect<{}, {}, IModuleFormProps>(mapStateToProps)(ModuleFormDecorated);
