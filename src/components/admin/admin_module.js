import React, { Component, PropTypes } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import axios from 'axios';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';

import Loader from '../loader';
import types from '../../actions/types';
import ModuleForm, { validateOnSubmit, FORM_NAME } from './forms/admin_module_form';

export class Modules extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modules: undefined,
      activeModule: undefined,
      messageText: '',
      messageShow: false,
    };
    this.createModule = this.createModule.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this.deleteModule = this.deleteModule.bind(this);
    this.resetState = this.resetState.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.fetchModules = this.fetchModules.bind(this);
  }

  componentDidMount() {
    this.fetchModules();
  }

  fetchModules() {
    axios.get(`${types.API}/modules/?inactive=true`, types.API_CONFIG)
    .then((response) => {
      this.setState({ modules: fromJS(response.data) });
    });
  }

  createModule(module) {
    validateOnSubmit(module);
    axios.post(`${types.API}/modules/`, module, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Created: ${module.get('name')}`))
    .catch(() => this.showMessage(`Error Creating Module: ${module.get('name')}`))
    .then(() => this.resetState());
  }

  updateModule() {
    const module = this.props.values;
    axios.put(`${types.API}/modules/${this.state.activeModule.get('id')}/`, module, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Updated: ${this.state.activeModule.get('name')}`))
    .catch(() => this.showMessage(`Error Updating Module: ${this.state.activeModule.get('name')}`))
    .then(() => this.resetState());
  }

  deleteModule() {
    axios.delete(`${types.API}/modules/${this.state.activeModule.get('id')}/`, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Deleted: ${this.state.activeModule.get('name')}`))
    .catch(() => this.showMessage(`Error Deleting Module: ${this.state.activeModule.get('name')}`))
    .then(() => this.resetState());
  }

  resetState() {
    this.setState({
      activeModule: undefined,
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

  renderModuleForm() {
    if (this.state.activeModule) {
      return (
        <ModuleForm
          module={this.state.activeModule}
          submitForm={this.createModule}
          update={this.updateModule}
          remove={this.deleteModule}
          clear={this.resetState}
          clean={false}
        />
      );
    }
    return (
      <ModuleForm
        submitForm={this.createModule}
        clear={this.resetState}
        clean
      />
    );
  }

  render() {
    const { modules } = this.state;
    if (!modules) {
      return (
        <div className="admin__modules">
          <Loader />
        </div>
      );
    }

    return (
      <div className="admin__modules">
        <div className="admin__modules-inner-container">
          <div className="admin__modules-list-container">
            <List className="admin__modules-list">
              {modules.map((module, i) => (
                <ListItem
                  key={i}
                  onClick={() => this.setState({ activeModule: module })}
                  primaryText={module.get('name')}
                  secondaryText={module.get('description')}
                />
              ))}
            </List>
          </div>
          <div className="admin__modules-form-container">
            {this.renderModuleForm()}
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

Modules.propTypes = {
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

export default connect(mapStateToProps)(Modules);
