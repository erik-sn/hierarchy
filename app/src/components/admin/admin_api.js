import React, { Component, PropTypes } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import axios from 'axios';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';

import Loader from '../loader';
import types from '../../actions/types';
import ApiForm, { validateOnSubmit, FORM_NAME } from './forms/admin_api_form';

export class ApiCalls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apicalls: undefined,
      activeApiCall: undefined,
      messageText: '',
      messageShow: false,
    };
    this.createApiCall = this.createApiCall.bind(this);
    this.updateApiCall = this.updateApiCall.bind(this);
    this.deleteApiCall = this.deleteApiCall.bind(this);
    this.resetState = this.resetState.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.fetchApiCalls = this.fetchApiCalls.bind(this);
  }

  componentDidMount() {
    this.fetchApiCalls();
  }

  fetchApiCalls() {
    axios.get(`${types.API}/apicalls/?inactive=true`, types.API_CONFIG)
    .then((response) => {
      this.setState({ apicalls: fromJS(response.data) });
    });
  }

  createApiCall(apicall) {
    validateOnSubmit(apicall);
    axios.post(`${types.API}/apicalls/`, apicall, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Created: ${apicall.get('name')}`))
    .catch(() => this.showMessage(`Error Creating API call: ${apicall.get('name')}`))
    .then(() => this.resetState());
  }

  updateApiCall() {
    const apiCall = this.props.values;
    axios.put(`${types.API}/apicalls/${this.state.activeApiCall.get('id')}/`, apiCall, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Updated: ${this.state.activeApiCall.get('name')}`))
    .catch(() => this.showMessage(`Error Updating API call: ${this.state.activeApiCall.get('name')}`))
    .then(() => this.resetState());
  }

  deleteApiCall() {
    axios.delete(`${types.API}/apicalls/${this.state.activeApiCall.get('id')}/`, types.API_CONFIG)
    .then(() => this.fetchApiCalls())
    .then(() => this.showMessage(`API call Successfully Deleted: ${this.state.activeApiCall.get('name')}`))
    .catch(() => this.showMessage(`Error Deleting API call: ${this.state.activeApiCall.get('name')}`))
    .then(() => this.resetState());
  }

  resetState() {
    this.setState({
      activeApiCall: undefined,
    });
  }

  showMessage(messageText) {
    this.setState({
      messageShow: true,
      messageText,
    });
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  renderApiCallForm() {
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

  render() {
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
            <List className="admin__apicalls-list">
              {apicalls.map((apicall, i) => (
                <ListItem
                  key={i}
                  onClick={() => this.setState({ activeApiCall: apicall })}
                  primaryText={apicall.get('url')}
                  secondaryText={apicall.get('description')}
                />
              ))}
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

ApiCalls.propTypes = {
  values: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  if (!state.get('form').get(FORM_NAME)) {
    return { values: {} };
  }
  return {
    values: state.get('form').get(FORM_NAME).get('values') || {},
  };
}

export default connect(mapStateToProps)(ApiCalls);
