import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Field, reduxForm } from 'redux-form/immutable';
import FlatButton from 'material-ui/FlatButton';

import { renderTextField as Text, renderCheckbox as CheckBox } from '../../../utils/form_renderer';

export const FORM_NAME = 'MODULE-CONFIG';

export class Module extends Component {

  componentWillMount() {
    this.props.reset();
  }

  componentWillReceiveProps(nextProps) {
    const { change, module } = nextProps;
    if ((module && !this.props.module) || (module && module.get('name') !== this.props.module.get('name'))) {
      change('id', module.get('id'));
      change('name', module.get('name'));
      change('description', module.get('description'));
      change('active', module.get('active'));
    }
  }

  render() {
    const { clean, submitForm, handleSubmit, update, remove, clear,
            reset, submitFailed } = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <Field className="admin__form-field" name="name" component={Text} label="Name" />
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
        {clean ? [
          <FlatButton
            key={4}
            type="submit"
            label="Submit"
            primary
          />,
        ] : [
          <FlatButton
            key={1}
            onClick={() => {
              update();
              reset();
            }}
            label="Update"
            primary
          />,
          <FlatButton
            key={2}
            onClick={() => {
              remove();
              reset();
            }}
            label="Delete"
            primary
          />,
        ]}
        <FlatButton
          key={3}
          onClick={() => {
            clear();
            reset();
          }}
          label="Cancel"
          primary
        />
      </form>
    );
  }
}


function mapStateToProps(state, ownProps) {
  if (ownProps.clean) {
    return { initialValues: { active: false } };
  }
  return {
    initialValues: ownProps.module,
  };
}

export const validateOnSubmit = (values) => {
  const errors = {};
  if (!values.get('name')) {
    throw new SubmissionError({ name: 'Name does not exixt' });
  }
  if (!values.get('description')) {
    throw new SubmissionError({ name: 'Description does not exixt' });
  }
  return errors;
};

export const validate = (values) => {
  const errors = {};
  if (!values.get('name')) {
    errors.name = 'Required';
  }
  if (!values.get('description')) {
    errors.description = 'Required';
  }
  return errors;
};

// Decorate the form component
const ModuleForm = reduxForm({
  form: FORM_NAME,
  validate,
})(Module);

export default connect(mapStateToProps)(ModuleForm);
