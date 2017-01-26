
import * as axios from 'axios';
import { fromJS } from 'immutable';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { connect } from 'react-redux';

import types from '../../actions/types';
import { IApiCall, IReduxState } from '../../constants/interfaces';
import Loader from '../loader';
import ApiForm, { FORM_NAME, validateOnSubmit } from './forms/admin_api_form';


export interface IApiCallsProps {
  apiCall?: IApiCall;
  apiCallForm?: IApiCall;
}

export interface IApiCallsState {
  apicalls: IApiCall[];
  activeApiCall: IApiCall;
  messageText: string;
  messageShow: boolean;
  filter: string;
  clean: boolean;
}

export class ApiCalls extends React.Component<IApiCallsProps, IApiCallsState> {

  constructor(props: IApiCallsProps) {
    super(props);
    this.state = {
      apicalls: undefined,
      activeApiCall: undefined,
      messageText: '',
      messageShow: false,
      filter: '',
      clean: true,
    };
    this.createApiCall = this.createApiCall.bind(this);
    this.updateApiCall = this.updateApiCall.bind(this);
    this.deleteApiCall = this.deleteApiCall.bind(this);
    this.resetState = this.resetState.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.fetchApiCalls = this.fetchApiCalls.bind(this);
  }

  public componentDidMount(): void {
    this.fetchApiCalls();
  }

  public fetchApiCalls(): void {
    axios.get(`${types.API}/apicalls/?inactive=true`, types.API_CONFIG)
    .then((response) => {
      this.setState({ apicalls: fromJS(response.data) });
    });
  }

  public createApiCall(apiCall: IApiCall): void {
    validateOnSubmit(apiCall);
    axios.post(`${types.API}/apicalls/`, apiCall, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Created: ${apiCall.key}`))
    .catch(() => this.showMessage(`Error Creating API call: ${apiCall.key}`))
    .then(() => this.resetState());
  }

  public updateApiCall(): void {
    const apiCallForm = this.props.apiCall;
    axios.put(`${types.API}/apicalls/${this.state.activeApiCall.id}/`, apiCallForm, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Updated: ${apiCallForm.key}`))
    .catch(() => this.showMessage(`Error Updating API call: ${apiCallForm.key}`))
    .then(() => this.resetState());
  }

  public deleteApiCall(): void {
    axios.delete(`${types.API}/apicalls/${this.state.activeApiCall.id}/`, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Deleted: ${this.state.activeApiCall.key}`))
    .catch(() => this.showMessage(`Error Deleting API call: ${this.state.activeApiCall.key}`))
    .then(() => this.resetState());
  }

  public resetState(): void {
    this.setState({
      activeApiCall: undefined,
    });
  }

  public showMessage(messageText: string): void {
    this.setState({
      messageShow: true,
      messageText,
    });
  }

  public handleMessageClose(): void {
    this.setState({ messageShow: false });
  }

  public handleFilter(event: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      filter: event.currentTarget.value,
    });
  }

  public renderApiCallForm(): JSX.Element {
    if (this.state.activeApiCall) {
      return (
        <ApiForm
          apicall={this.state.activeApiCall}
          submitForm={this.createApiCall}
          update={this.updateApiCall}
          remove={this.deleteApiCall}
          clear={this.resetState}
          clean={false}
        />
      );
    }
    return (
      <ApiForm
        submitForm={this.createApiCall}
        clear={this.resetState}
        clean
      />
    );
  }

  public generateApiCalls(): JSX.Element[] {
    const { apicalls, filter } = this.state;
    let filteredApicalls = apicalls;
    if (filter.trim()) {
      filteredApicalls = apicalls.filter((module) => (
        module.key.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
        module.url.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ));
    }
    return filteredApicalls.map((apicall, i) => {
      const apiItemClick = () => this.setState({ activeApiCall: apicall, clean: false });
      return (
        <ListItem
          key={i}
          onClick={apiItemClick}
          primaryText={apicall.key}
          secondaryText={apicall.url}
        />
      );
    });
  }

  public render() {
    const { apicalls } = this.state;
    if (!apicalls) {
      return (
        <div className="admin__apicalls">
          <Loader />
        </div>
      );
    }

    return (
      <div className="admin__apicalls">
        <div className="admin__apicalls-inner-container">
          <div className="admin__apicalls-list-container">
            <TextField
              id="admin__apicalls-filter"
              hintText="API Call Filter"
              value={this.state.filter}
              onChange={this.handleFilter}
            />
            <List>
              {this.generateApiCalls()}
            </List>
          </div>
          <div className="admin__apicalls-form-container">
            {this.renderApiCallForm()}
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

function mapStateToProps(state: any) {
  const reduxState: IReduxState = state.toJS();
  if (!reduxState.form[FORM_NAME]) {
    return { apiCallForm: {} };
  }
  return {
    apiCallForm: reduxState.form[FORM_NAME].values || {},
  };
}

export default connect<{}, {}, IApiCallsProps>(mapStateToProps)(ApiCalls);
