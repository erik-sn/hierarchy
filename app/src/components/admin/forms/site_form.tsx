import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Field, reduxForm } from 'redux-form';

import { IFormValues, IModule, IReduxState, ISite } from '../../../constants/interfaces';
import { renderCheckbox as CheckBox, renderNullField as Null,
  renderTextField as Text } from '../../../utils/form_renderer';
import ModuleEdit from './module_edit';

export interface ISiteFormProps {
  submitForm: (form: {}) => void;
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  change?: (key: string, value: any) => void;
  site?: ISite;
  modules?: IModule[];
}

export interface IValidationForm {
  name?: string;
  code?: string;
}

/**
 * Form component used for CRUD operations on the Site object
 * 
 * @class SiteForm
 * @extends {React.Component<ISiteFormProps, {}>}
 */
class SiteForm extends React.Component<ISiteFormProps, {}> {

  constructor(props: ISiteFormProps) {
    super(props);
    this.clearForm = this.clearForm.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }


  /**
   * helper function to clean jsx, render the ModuleEdit interface
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf SiteForm
   */
  public renderModuleEdit(): JSX.Element {
    const { change, modules, site } = this.props;
    return (
      <ModuleEdit
        parentObject={site}
        modules={modules}
        change={change}
      />
    );
  }

  /**
   * navigate using react-router back to the hierarchy home
   * 
   * @memberOf SiteForm
   */
  public navigateHome(): void {
    browserHistory.push('/admin/hierarchy/');
  }


  /**
   * Reset form back to default values
   * 
   * @memberOf SiteForm
   */
  public clearForm(): void {
    const { change } = this.props;
    change('name', '');
    change('code', '');
    change('directory', '');
    change('active', true);
    change('location', '');
    change('address', '');
    change('latitude', '');
    change('longitude', '');

  }

  public render() {
    const { change, submitForm, handleSubmit, site, modules } = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <div className="admin__form-section" >
          <h3>General</h3>
          <Field className="admin__form-field" name="id" component={Null} />
          <Field className="admin__form-field" name="name" component={Text} label="Name" />
          <Field className="admin__form-field" name="code" component={Text} label="Code" />
          <Field className="admin__form-field" name="directory" component={Text} label="Directory" />
          <div style={{ width: '100%', height: '20px' }} />
          <Field
            className="admin__form-field"
            name="active"
            type="checkbox"
            component={CheckBox}
            label="Active"
          />
          <div style={{ width: '100%', height: '30px' }} />
        </div>
        <div className="admin__form-section" >
          <h3>Location</h3>
          <Field className="admin__form-field" name="location" component={Text} label="Location" />
          <Field className="admin__form-field" name="address" component={Text} label="Address" />
          <Field className="admin__form-field" name="latitude" component={Text} label="Latitude" />
          <Field className="admin__form-field" name="longitude" component={Text} label="Longitude" />
        </div>
        <div className="admin__form-section" >
          {site ? this.renderModuleEdit() : undefined}
        </div>
        <div className="admin__lower-form-section">
          <FlatButton
            label="Submit"
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
            onClick={this.navigateHome}
            primary
          />
        </div>
      </form>
    );
  }
}


/**
 * Initialize the form with the site that was passed through props
 * or a set of default values if it does not exist
 * 
 * @param {IReduxState} state
 * @param {ISiteFormProps} ownProps
 * @returns {IFormValues}
 */
function mapStateToProps(state: IReduxState, ownProps: ISiteFormProps): IFormValues {
  if (ownProps.site) {
    return { initialValues: ownProps.site };
  }
  return { initialValues: { active: true, modules: [] } };
}

// syncronous validation function
export const validate = (formValues: IValidationForm): IValidationForm => {
  const errors: IValidationForm = {};
  if (!formValues.name) {
    errors.name = 'Required';
  }
  if (!formValues.code) {
    errors.code = 'Required';
  } else if (!formValues.code.match(/[A-Z]+/)) {
    errors.code = 'Must be uppercase Letters';
  }
  return errors;
};

// Decorate the form component
const SiteFormDecorated = reduxForm({
  form: 'site_config',
})(SiteForm);

export default connect<{}, {}, ISiteFormProps>(mapStateToProps)(SiteFormDecorated);
