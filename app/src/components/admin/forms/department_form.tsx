import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { IApiCall, IDepartment, IFormValues, IModule, IReduxState } from '../../../constants/interfaces';
import { RenderCheckbox as checkbox, renderNullField, renderTextField } from '../../../utils/form_renderer';
import ApiEdit from './api_edit';
import ModuleEdit from './module_edit';

export interface IDepartmentFormProps {
  submitForm: (form: {}) => void;
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  change?: (key: string, value: any) => void;
  clear?: () => void;
  cancel?: () => void;
  reset?: () => void;
  department?: IDepartment;
  apiCalls?: IApiCall[];
  modules?: IModule[];
}

export interface IValidationForm {
  name?: string;
}

/**
 * Form to handle CRUD operations on department objects
 *
 * @class DepartmentForm
 * @extends {React.Component<IDepartmentFormProps, {}>}
 */
export class DepartmentForm extends React.Component<IDepartmentFormProps, {}> {

  constructor(props: IDepartmentFormProps) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /**
   * actions to take when cancel button is clicked
   *
   * @memberOf DepartmentForm
   */
  public handleCancel(): void {
    this.props.cancel();
    this.props.reset();
  }

  /**
   * helper method to contain rendering the Module and
   * Api Call edit components
   *
   * @returns {JSX.Element}
   *
   * @memberOf DepartmentForm
   */
  public renderSubForms(): JSX.Element {
    const { apiCalls, change, department, modules } = this.props;
    return (
      <div>
        <ModuleEdit
          parentObject={department}
          modules={modules}
          change={change}
        />
        <ApiEdit
          department={department}
          apiCalls={apiCalls}
          change={change}
        />
      </div>
    );
  }

  public render() {
    const { handleSubmit, submitForm, change, department }: IDepartmentFormProps = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <div className="admin__form-section">
          <div className="mui-form-component">
            <Field
              className="admin__form-field"
              name="name"
              component={renderTextField}
              label="Name"
            />
            <Field
              className="admin__form-field"
              name="defaultModule"
              component={renderNullField}
              label="Default Module"
            />
            <div style={{ width: '100%', height: '20px' }} />
            <Field
              className="admin__form-field"
              name="active"
              type="checkbox"
              component={checkbox}
              label="Active"
            />
            <div style={{ width: '100%', height: '20px' }} />
          </div>
        </div>
        <div className="admin__form-section" >
          {department ? this.renderSubForms() : undefined}
        </div>
        <div className="admin__lower-form-section">
          <FlatButton
            label={department ? 'Update' : 'Create'}
            type="submit"
            keyboardFocused
            primary
          />
          <FlatButton
            label="Cancel"
            onClick={this.handleCancel}
            primary
          />
        </div>
      </form>
    );
  }
}

/**
 * Initialize the form with values from either the passed Department,
 * or a set of default values.
 *
 * @param {IReduxState} state
 * @param {IDepartmentFormProps} ownProps
 * @returns {IFormValues}
 */
function mapStateToProps(state: IReduxState, ownProps: IDepartmentFormProps): IFormValues {
  if (ownProps.department) {
    const initialValues = ownProps.department;
    const defaultModule = ownProps.department.defaultModule;
    initialValues.defaultModule = defaultModule ? defaultModule : undefined;
    return { initialValues };
  }
  return { initialValues: { active: true, modules: [] } };
}

// Decorate the form component
const DepartmentFormDecorated = reduxForm({
  form: 'department_form',
})(DepartmentForm);

export default connect<{}, {}, IDepartmentFormProps>(mapStateToProps)(DepartmentFormDecorated);
