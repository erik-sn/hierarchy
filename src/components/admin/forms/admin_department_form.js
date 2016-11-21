import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import ModuleEdit from './admin_module_edit';
import { renderTextField, renderCheckbox } from '../../../utils/form_renderer';

const Department = ({ handleSubmit, submitForm, change, modules, department, modal }) => (
  <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
    <div className="admin__form-section">
      <div className="mui-form-component">
        <Field
          className="admin__form-field"
          name="name"
          component={renderTextField}
          label="Name"
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
      {modal ? '' :
        <ModuleEdit
          item={department}
          modules={modules}
          change={change}
        />
      }
    </div>
    <div className="admin__lower-form-section">
      <FlatButton
        label={modal ? 'Create' : 'Update'}
        type="submit"
        keyboardFocused
        primary
      />
      <FlatButton
        label="Clear"
        onClick={() => {
          change('name', '');
          change('active', false);
        }}
        primary
      />
    </div>
  </form>
);


function mapStateToProps(state, ownProps) {
  if (ownProps.new) {
    return { initialValues: { active: true, modules: [] } };
  }
  return {
    initialValues: ownProps.department.toJS(),
  };
}

export const validate = (values) => {
  const errors = {};
  if (!values.get('name')) {
    errors.name = 'Required';
  } else if (!values.get('name').match(/[a-zA-Z]+/)) {
    errors.name = 'Name can only contain letters';
  }
  return errors;
};

// Decorate the form component
const DepartmentForm = reduxForm({
  form: 'department_form',
  validate,
})(Department);

export default connect(mapStateToProps)(DepartmentForm);
