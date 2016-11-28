import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import ModuleEdit from './admin_module_edit';
import { renderTextField, renderCheckbox } from '../../../utils/form_renderer';

export const Machine = ({ change, handleSubmit, submitForm, modal, machine, modules }) => (
  <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
    <div className="admin__machine-container">
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
      {modal ? '' :
        <ModuleEdit
          item={machine}
          modules={modules}
          change={change}
        />
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
          change('type', '');
          change('active', false);
        }}
        primary
      />
    </div>
  </form>
);

Machine.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  modules: PropTypes.object.isRequired,
  machine: PropTypes.object.isRequired,
  modal: PropTypes.bool,
};

function mapStateToProps(state, ownProps) {
  if (ownProps.new) {
    return { initialValues: { active: true, modules: [] } };
  }
  return {
    initialValues: ownProps.machine.toJS(),
  };
}

export const validate = (values) => {
  const errors = {};
  if (!values.get('name')) {
    errors.name = 'Required';
  } else if (!values.get('name').match(/^[a-zA-Z0-9 ]+$/)) {
    errors.name = 'Name can only contain letters and numbers';
  }
  if (!values.get('type')) {
    errors.type = 'Required';
  } else if (!values.get('type').match(/^[a-zA-Z0-9 ]+$/)) {
    errors.type = 'Type can only contain letters and numbers';
  }
  return errors;
};


// Decorate the form component
const MachineForm = reduxForm({
  form: 'machine_form',
  validate,
})(Machine);

export default connect(mapStateToProps)(MachineForm);
