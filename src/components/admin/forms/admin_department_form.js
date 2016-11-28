import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import ModuleEdit from './admin_module_edit';
import ApiEdit from './admin_api_edit';
import { renderTextField, renderCheckbox } from '../../../utils/form_renderer';

export const Department = ({ handleSubmit, submitForm, change, modules, apicalls, department, modal }) => (
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
        <div>
          <ModuleEdit
            item={department}
            modules={modules}
            change={change}
          />
          <ApiEdit
            item={department}
            apicalls={apicalls}
            change={change}
          />
        </div>
      }
    </div>
    <div className="admin__lower-form-section">
      <FlatButton
        className="admin__submit-button"
        label={modal ? 'Create' : 'Update'}
        type="submit"
        keyboardFocused
        primary
      />
      <FlatButton
        className="admin__clear-button"
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

Department.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  modules: PropTypes.object.isRequired,
  apicalls: PropTypes.object.isRequired,
  department: PropTypes.object,
  modal: PropTypes.bool,
};

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
  } else if (!values.get('name').match(/^[a-zA-Z ]+$/)) {
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
