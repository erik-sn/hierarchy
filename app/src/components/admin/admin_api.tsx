
import * as axios from 'axios';
import { fromJS } from 'immutable';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Add from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { connect } from 'react-redux';

import types from '../../actions/types';
import { IApiCall, IModule, IReduxState } from '../../constants/interfaces';
import Loader from '../loader';
import Modal from '../modal';
import ApiForm, { FORM_NAME, validateOnSubmit } from './forms/api_form';


export interface IApiCallsProps {
  apiCall?: IApiCall;
  apiCallForm?: IApiCall;
}

export interface IApiCallsState {
  apiCalls: IApiCall[];
  activeApiCall: IApiCall;
  messageText: string;
  messageShow: boolean;
  filter: string;
  showNewForm: boolean;
}


/**
 * Controller component that handles operations on ApiCall objects
 * 
 * @export
 * @class ApiCallAdmin
 * @extends {React.Component<IApiCallsProps, IApiCallsState>}
 */
export class ApiCallAdmin extends React.Component<IApiCallsProps, IApiCallsState> {

  constructor(props: IApiCallsProps) {
    super(props);
    this.state = {
      apiCalls: undefined,
      activeApiCall: undefined,
      messageText: '',
      messageShow: false,
      filter: '',
      showNewForm: false,
    };
    this.createApiCall = this.createApiCall.bind(this);
    this.updateApiCall = this.updateApiCall.bind(this);
    this.deleteApiCall = this.deleteApiCall.bind(this);
    this.resetState = this.resetState.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.fetchApiCalls = this.fetchApiCalls.bind(this);
    this.toggleShowNewForm = this.toggleShowNewForm.bind(this);
  }

  public componentDidMount(): void {
    this.fetchApiCalls();
  }

  /**
   * Retrieve all api calls from the database
   * 
   * @memberOf ApiCallAdmin
   */
  public fetchApiCalls(): void {
    axios.get(`${types.API}/apicalls/?inactive=true`, types.API_CONFIG)
    .then((response) => {
      this.setState({ apiCalls: response.data as IApiCall[] });
    });
  }


  /**
   * Add an Api Call to the database
   * 
   * @param {IApiCall} apiCall - object to be added
   * 
   * @memberOf ApiCallAdmin
   */
  public createApiCall(apiCall: IApiCall): void {
    validateOnSubmit(apiCall);
    axios.post(`${types.API}/apicalls/`, apiCall, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Created: ${apiCall.key}`))
    .catch(() => this.showMessage(`Error Creating API call: ${apiCall.key}`))
    .then(() => this.resetState());
  }


  /**
   * Update an Api Call in the database
   * 
   * @memberOf ApiCallAdmin
   */
  public updateApiCall(): void {
    const apiCallForm = this.props.apiCall;
    axios.put(`${types.API}/apicalls/${this.state.activeApiCall.id}/`, apiCallForm, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Updated: ${apiCallForm.key}`))
    .catch(() => this.showMessage(`Error Updating API call: ${apiCallForm.key}`))
    .then(() => this.resetState());
  }


  /**
   * Delete an Api Call from the database
   * 
   * @memberOf ApiCallAdmin
   */
  public deleteApiCall(): void {
    axios.delete(`${types.API}/apicalls/${this.state.activeApiCall.id}/`, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Deleted: ${this.state.activeApiCall.key}`))
    .catch(() => this.showMessage(`Error Deleting API call: ${this.state.activeApiCall.key}`))
    .then(() => this.resetState());
  }


  /**
   * Set the controller back to a default state
   * 
   * @memberOf ApiCallAdmin
   */
  public resetState(): void {
    this.setState({
      activeApiCall: undefined,
    });
  }


  /**
   * Show a message to the user using the snackbar component
   * 
   * @param {string} messageText - message to show
   * 
   * @memberOf ApiCallAdmin
   */
  public showMessage(messageText: string): void {
    this.setState({
      messageShow: true,
      messageText,
    });
  }

  /**
   * Close the message Snackbar
   * 
   * @memberOf ApiCallAdmin
   */
  public handleMessageClose(): void {
    this.setState({ messageShow: false });
  }

  /**
   * Toggle the state of showNewForm which controls whether
   * or not the Modal containing an ApiForm is rendered
   * 
   * @memberOf ApiCallAdmin
   */
  public toggleShowNewForm(): void {
    this.setState({
      activeApiCall: undefined,
      showNewForm: !this.state.showNewForm,
    });
  }


  /**
   * Set the state of the filter based on user input
   * 
   * @param {React.FormEvent<HTMLInputElement>} event
   * 
   * @memberOf ApiCallAdmin
   */
  public handleFilterChange(event: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      filter: event.currentTarget.value,
    });
  }

  /**
   * Render the update form. This form has the activeApiCall
   * passed as props which will conver the form to be in edit
   * and delete mode rather than create.
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf ApiCallAdmin
   */
  public renderApiCallForm(): JSX.Element {
    return (
      <ApiForm
        apiCall={this.state.activeApiCall}
        submitForm={this.updateApiCall}
        remove={this.deleteApiCall}
        cancel={this.resetState}
      />
    );
  }


  /**
   * Render the create form. This form will be rendered inside
   * a modal and have only the create operation.
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf ApiCallAdmin
   */
  public renderNewApiCallForm(): JSX.Element {
    return (
      <Modal
        title="Create New API Call"
        onCancel={this.toggleShowNewForm}
      >
        <ApiForm submitForm={this.createApiCall} />
      </Modal>
    );
  }


  /**
   * Filter listed api calls based on user input in the
   * filter box. 
   * 
   * @returns {IApiCall[]}
   * 
   * @memberOf ApiCallAdmin
   */
  public filteredApiCalls(): IApiCall[] {
    const { apiCalls, filter } = this.state;
    if (filter.trim()) {
      return apiCalls.filter((call) => (
        call.key.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
        call.url.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ));
    }
    return apiCalls;
  }


  /**
   * Generate a list of ListItems that contain the
   * 
   * @returns {JSX.Element[]}
   * 
   * @memberOf ApiCallAdmin
   */
  public generateApiCalls(): JSX.Element[] {
    return this.filteredApiCalls().map((apiCall, i) => {
      const apiItemClick = () => this.setState({ activeApiCall: apiCall });
      return (
        <ListItem
          key={i}
          onClick={apiItemClick}
          primaryText={apiCall.key}
          secondaryText={apiCall.url}
        />
      );
    });
  }

  public render() {
    const { apiCalls, showNewForm, activeApiCall } = this.state;
    if (!apiCalls) {
      return (
        <div className="admin__apicalls">
          <Loader />
        </div>
      );
    }

    return (
      <div className="admin__apicalls">
        {showNewForm ? this.renderNewApiCallForm() : undefined}
        <div className="admin__apicalls-inner-container">
          <div className="admin__apicalls-list-container">
            <TextField
              id="admin__apicalls-filter"
              hintText="API Call Filter"
              value={this.state.filter}
              onChange={this.handleFilterChange}
            />
            <List style={{ maxHeight: '400px', overflowY: 'auto' }} >
              {this.generateApiCalls()}
            </List>
            <div
              className="admin__modules-new-module-container"
              onClick={this.toggleShowNewForm}
            >
              <Add />
              <span>New API Call</span>
            </div>
          </div>
          <div className="admin__apicalls-form-container">
            {activeApiCall ? this.renderApiCallForm() : <h3>Select an API Call</h3>}
          </div>
        </div>
        <Snackbar
          open={this.state.messageShow}
          message={this.state.messageText}
          action="Ok"
          autoHideDuration={10000}
          onActionTouchTap={this.handleMessageClose}
          onRequestClose={this.handleMessageClose}
        />
      </div>
    );
  }
}


/**
 * Initialize the  form values
 * 
 * @param {IReduxState} state
 * @returns {*}
 */
function mapStateToProps(state: IReduxState): any {
  if (!state.form[FORM_NAME]) {
    return { apiCallForm: {} };
  }
  return {
    apiCallForm: state.form[FORM_NAME].values || {},
  };
}

export default connect<{}, {}, IApiCallsProps>(mapStateToProps)(ApiCallAdmin);
