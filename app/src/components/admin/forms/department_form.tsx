import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { IApiCall, IDepartment, IFormValues, IModule, IReduxState } from '../../../constants/interfaces';
import { renderCheckbox, renderNullField, renderTextField } from '../../../utils/form_renderer';
import ApiEdit from './api_edit';
import ModuleEdit from './module_edit';

export interface IDepartmentFormProps {
  submitForm: (form: {}) => void;
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  change?: (key: string, value: any) => void;
  clear?: () => void;
  reset?: () => void;
  department?: IDepartment;
  apiCalls?: IApiCall[];
  modules?: IModule[];
}

export interface IValidationForm {
  name?: string;
}


class DepartmentForm extends React.Component<IDepartmentFormProps, {}> {

  public handleCancel(): void {
    this.props.clear();
    this.props.reset();
  }

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
              component={renderCheckbox}
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


function mapStateToProps(state: IReduxState, ownProps: IDepartmentFormProps): IFormValues {
  if (ownProps.department) {
    const initialValues = ownProps.department;
    const defaultModule = ownProps.department.defaultModule;
    initialValues.defaultModule = defaultModule ? defaultModule : undefined;
    return { initialValues };
  }
  return { initialValues: { active: true, modules: [] } };
}

export const validate = (values: IValidationForm): IValidationForm => {
  const errors: IValidationForm = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

// Decorate the form component
const DepartmentFormDecorated = reduxForm({
  form: 'department_form',
  validate,
})(DepartmentForm);

export default connect<{}, {}, IDepartmentFormProps>(mapStateToProps)(DepartmentFormDecorated);
