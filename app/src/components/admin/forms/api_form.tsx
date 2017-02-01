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

/**
 * Form component that handles CRUD operations on API calls
 * 
 * @export
 * @class ApiForm
 * @extends {React.Component<IApiFormProps, {}>}
 */
export class ApiForm extends React.Component<IApiFormProps, {}> {

  constructor(props: IApiFormProps) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  public componentWillMount() {
    this.props.reset();  // for initializing form
  }


  /**
   * When the component receives a new set of props check to see
   * if it contains a different ApiCall. If so, set that api call
   * into the form. 
   * 
   * @param {IApiFormProps} nextProps
   * 
   * @memberOf ApiForm
   */
  public componentWillReceiveProps(nextProps: IApiFormProps) {
    const { change, apiCall } = nextProps;
    if ((apiCall && !this.props.apiCall) || (apiCall && apiCall.id !== this.props.apiCall.id)) {
      change('id', apiCall.id);
      change('url', apiCall.url);
      change('key', apiCall.key);
      change('description', apiCall.description);
      change('active', apiCall.active);
    }
  }

  /**
   * handle actions for when the delete button is clicked
   * 
   * @memberOf ApiForm
   */
  public handleDelete(): void {
    this.props.remove();
    this.props.reset();
  }

  /**
   * handle actions for when the cancel button is clicked 
   * 
   * @memberOf ApiForm
   */
  public handleCancel(): void {
    this.props.cancel();
    this.props.reset();
  }

  /**
   * handle action when the clear button is clicked. into
   * this case we use the redux-form function change to
   * set all fields back to their defaults
   * 
   * @memberOf ApiForm
   */
  public clearForm() {
    const { change } = this.props;
    change('key', '');
    change('description', '');
    change('url', '');
    change('active', true);
  }

  /**
   * Render buttons associated with a new form
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf ApiForm
   */
  public renderNewFormButtons(): JSX.Element {
    return (
      <FlatButton
        key={4}
        type="submit"
        label="Submit"
        primary
      />
    );
  }

  /**
   * Render buttons associated with updating an Api Call
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf ApiForm
   */
  public renderUpdateFormButtons(): JSX.Element {
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
        {apiCall ? this.renderUpdateFormButtons() : this.renderNewFormButtons()}
        <FlatButton
          key={9}
          onClick={this.clearForm}
          label="Clear"
          primary
        />
        {apiCall ?
        <FlatButton
          key={10}
          onClick={this.handleCancel}
          label="Cancel"
          primary
        /> : undefined}
      </form>
    );
  }
}


/**
 * Initialize the form with the values of the incoming API call
 * 
 * @param {IReduxState} state - application state
 * @param {IApiFormProps} ownProps - props that were passed directly to the component
 * @returns
 */
function mapStateToProps(state: IReduxState, ownProps: IApiFormProps) {
  if (ownProps.apiCall) {
    return { initialValues: ownProps.apiCall };
  }
  return { initialValues: { active: true } };
}

// validation function used when form is submitted
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

// validation function used for synchronous form validation
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
})(ApiForm);

export default connect<{}, {}, IApiFormProps>(mapStateToProps)(ApiFormDecorated);

