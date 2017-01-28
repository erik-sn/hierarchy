import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import { IApiCall, IModule, IReduxState, ISite } from '../../../constants/interfaces';
import { renderCheckbox as CheckBox, renderTextField as Text } from '../../../utils/form_renderer';

export const FORM_NAME = 'API-CONFIG';

export interface IApiFormProps {
  submitForm: (form: {}) => void;
  handleSubmit?: (submitForm: {}) => React.EventHandler<React.FormEvent<HTMLFormElement>>;
  change?: (key: string, value: any) => void;
  reset?: () => void;
  remove?: () => void;
  cancel?: () => void;
  submitFailed?: boolean;
  apiCall?: IApiCall;
}

export interface IValidationForm {
  url?: string;
  key?: string;
  name?: string;
  description?: string;
}

export class ApiForm extends React.Component<IApiFormProps, {}> {

  constructor(props: IApiFormProps) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  public componentWillMount() {
    this.props.reset();
  }

  public componentWillReceiveProps(nextProps: IApiFormProps) {
    const { change, apiCall } = nextProps;
    if ((apiCall && !this.props.apiCall) || (apiCall && apiCall.url !== this.props.apiCall.url)) {
      change('id', apiCall.id);
      change('url', apiCall.url);
      change('key', apiCall.key);
      change('description', apiCall.description);
      change('active', apiCall.active);
    }
  }

  public handleDelete(): void {
    this.props.remove();
    this.props.reset();
  }

  public handleCancel(): void {
    this.props.cancel();
    this.props.reset();
  }

  public clearForm() {
    const { change } = this.props;
    change('key', '');
    change('description', '');
    change('url', '');
    change('active', true);
  }

  public renderCleanButtons(): JSX.Element {
    return (
      <FlatButton
        key={4}
        type="submit"
        label="Submit"
        primary
      />
    );
  }

  public renderUpdateButtons(): JSX.Element {
    return (
      <div>
        <FlatButton
          key={2}
          onClick={this.handleDelete}
          label="Delete"
          primary
        />
        <FlatButton
          key={1}
          type="submit"
          label="Update"
          primary
        />
      </div>
    );
  }

  public render() {
    const { apiCall, submitForm, handleSubmit, remove, reset, submitFailed } = this.props;
    return (
      <form onSubmit={handleSubmit(submitForm)} className="admin__form-container" >
        <Field className="admin__form-field" name="key" component={Text} label="Key" />
        <Field
          className="admin__form-field"
          name="description"
          component={Text}
          label="Description"
        />
        <div style={{ width: '100%' }} >
          <Field className="admin__form-field" name="url" component={Text} label="Url" />
        </div>
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
        {apiCall ? this.renderUpdateButtons() : this.renderCleanButtons()}
        <FlatButton
          key={9}
          onClick={this.clearForm}
          label="Clear"
          primary
        />
        <FlatButton
          key={10}
          onClick={this.handleCancel}
          label="Cancel"
          primary
        />
      </form>
    );
  }
}

function mapStateToProps(state: IReduxState, ownProps: IApiFormProps) {
  if (ownProps.apiCall) {
    return { initialValues: ownProps.apiCall };
  }
  return { initialValues: { active: true } };
}

export const validateOnSubmit = (values: IValidationForm): IValidationForm => {
  const errors: IValidationForm = {};
  if (!values.url) {
    throw new SubmissionError({ url: 'Url does not exixt' });
  }
  if (!values.key) {
    throw new SubmissionError({ key: 'Key does not exixt' });
  }
  if (!values.description) {
    throw new SubmissionError({ name: 'Description does not exixt' });
  }
  return errors;
};

export const validate = (values: IValidationForm): IValidationForm => {
  const errors: IValidationForm = {};
  if (!values.url) {
    errors.url = 'Required';
  }
  if (!values.key) {
    errors.key = 'Required';
  }
  if (!values.description) {
    errors.description = 'Required';
  }
  return errors;
};

// Decorate the form component
const ApiFormDecorated = reduxForm({
  form: FORM_NAME,
  validate,
})(ApiForm);

export default connect<{}, {}, IApiFormProps>(mapStateToProps)(ApiFormDecorated);

