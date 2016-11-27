import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';

import ModuleEdit from './admin_module_edit';
import { renderTextField as Text, renderCheckbox as CheckBox,
  renderNullField as Null } from '../../../utils/form_renderer';

export const Configuration = ({ change, submitForm, handleSubmit, site, modules, modal }) => (
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
      {modal ? '' :
        <ModuleEdit
          item={site}
          modules={modules}
          change={change}
        />
      }
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
        primary
      />
    </div>
  </form>
);

Configuration.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  modules: PropTypes.object.isRequired,
  site: PropTypes.object.isRequired,
  modal: PropTypes.bool,
};

function mapStateToProps(state, ownProps) {
  // if we are in "new mode" - creating a new site
  if (ownProps.new) {
    return { initialValues: { active: true, modules: [] } };
  }
  return {
    initialValues: ownProps.site.toJS(),
  };
}

export const validate = (values) => {
  const errors = {};
  if (!values.get('name')) {
    errors.name = 'Required';
  }
  if (!values.get('code')) {
    errors.code = 'Required';
  } else if (!values.get('code').match(/[A-Z]+/)) {
    errors.code = 'Must be uppercase Letters';
  }
  return errors;
};

// Decorate the form component
const ConfigurationForm = reduxForm({
  form: 'site_config',
  validate,
})(Configuration);

export default connect(mapStateToProps)(ConfigurationForm);
