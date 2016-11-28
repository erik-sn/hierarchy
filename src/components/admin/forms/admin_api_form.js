import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Field, reduxForm } from 'redux-form/immutable';
import FlatButton from 'material-ui/FlatButton';

import { renderTextField as Text, renderCheckbox as CheckBox } from '../../../utils/form_renderer';

export const FORM_NAME = 'API-CONFIG';

export class API extends Component {

  componentWillMount() {
    this.props.reset();
  }

  componentWillReceiveProps(nextProps) {
    const { change, apicall } = nextProps;
    if ((apicall && !this.props.apicall) || (apicall && apicall.get('url') !== this.props.apicall.get('url'))) {
      change('id', apicall.get('id'));
      change('url', apicall.get('url'));
      change('key', apicall.get('key'));
      change('description', apicall.get('description'));
      change('active', apicall.get('active'));
    }
  }

  render() {
    const { clean, submitForm, handleSubmit, update, remove, clear,
            reset, submitFailed } = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <Field className="admin__form-field" name="key" component={Text} label="Key" />
        <Field className="admin__form-field" name="url" component={Text} label="Url" />
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

API.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  change: PropTypes.func,
  update: PropTypes.func,
  remove: PropTypes.func,
  clear: PropTypes.func,
  reset: PropTypes.func,
  submitFailed: PropTypes.bool,
  apicall: PropTypes.object,
  clean: PropTypes.bool,
};

function mapStateToProps(state, ownProps) {
  if (ownProps.clean) {
    return { initialValues: { active: false } };
  }
  return {
    initialValues: ownProps.apicall,
  };
}

export const validateOnSubmit = (values) => {
  const errors = {};
  if (!values.get('url')) {
    throw new SubmissionError({ url: 'Url does not exixt' });
  }
  if (!values.get('key')) {
    throw new SubmissionError({ key: 'Key does not exixt' });
  }
  if (!values.get('description')) {
    throw new SubmissionError({ name: 'Description does not exixt' });
  }
  return errors;
};

export const validate = (values) => {
  const errors = {};
  if (!values.get('url')) {
    errors.url = 'Required';
  }
  if (!values.get('key')) {
    errors.key = 'Required';
  }
  if (!values.get('description')) {
    errors.description = 'Required';
  }
  return errors;
};

// Decorate the form component
const ApiForm = reduxForm({
  form: FORM_NAME,
  validate,
})(API);

export default connect(mapStateToProps)(ApiForm);

