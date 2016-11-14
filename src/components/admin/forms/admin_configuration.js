import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { toJS } from 'immutable';
import { connect } from 'react-redux';

import { renderTextField as Text, renderCheckbox as Check } from '../../../utils/form_renderer';

const Configuration = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit} className="admin__form-container" >
    <div className="admin__form-section" >
      <h3>General</h3>
      <Field className="admin__form-field" name="name" component={Text} label="Name" />
      <Field className="admin__form-field" name="code" component={Text} label="Code" />
      <Field className="admin__form-field" name="directory" component={Text} label="Directory" />
      <div style={{ width: '100%', height: '20px' }} />
      <Field className="admin__form-field" name="active" component={Check} label="Active" />
      <div style={{ width: '100%', height: '30px' }} />
    </div>
    <div className="admin__form-section" >
      <h3>Location</h3>
      <Field className="admin__form-field" name="location" component={Text} label="Location" />
      <Field className="admin__form-field" name="address" component={Text} label="Address" />
      <Field className="admin__form-field" name="latitude" component={Text} label="Latitude" />
      <Field className="admin__form-field" name="longitude" component={Text} label="Longitude" />
    </div>
  </form>
);

function mapStateToProps(state, ownProps) {
  const site = ownProps.site;
  return {
    initialValues: {
      name: site.get('name'),
      code: site.get('code'),
      directory: site.get('directory'),
      active: site.get('active'),
      location: site.get('location'),
      address: site.get('address'),
      latitude: site.get('latitude'),
      longitude: site.get('longitude'),
    },
  };
}

// Decorate the form component
const ConfigurationForm = reduxForm({
  form: 'site_config',
})(Configuration);

export default connect(mapStateToProps)(ConfigurationForm);
