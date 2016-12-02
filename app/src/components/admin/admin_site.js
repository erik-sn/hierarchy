import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { fromJS } from 'immutable';
import { CardTitle } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Settings from 'material-ui/svg-icons/action/settings';
import Business from 'material-ui/svg-icons/communication/business';
import Router from 'material-ui/svg-icons/hardware/router';
import Snackbar from 'material-ui/Snackbar';

import ConfigurationForm from './forms/admin_configuration';
import DepartmentAdmin from './admin_department';
import MachineAdmin from './admin_machine';
import types from '../../actions/types';


const getConfigName = (site, splat) => {
  const siteCode = site.get('code').toLowerCase();
  return splat.replace(`/${siteCode}`.toLowerCase(), '').replace('/', '');
};

class AdminSite extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
      messageShow: false,
      apicalls: undefined,
      modules: undefined,
    };
    this.updateSite = this.updateSite.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  componentDidMount() {
    axios.get(`${types.API}/modules/`, types.API_CONFIG)
    .then(response => this.setState({
      modules: fromJS(response.data),
    }))
    .catch(() => this.showMessage('Error Loading Modules'));


    axios.get(`${types.API}/apicalls/`, types.API_CONFIG)
    .then(response => this.setState({
      apicalls: fromJS(response.data),
    }))
    .catch(() => this.showMessage('Error Loading Api Calls'));
  }

  updateSite(site) {
    const url = `${types.API}/sites/${site.get('id')}/`;
    axios.put(url, site, types.API_CONFIG)
    .then(() => this.showMessage(`Site Successfully Updated: ${site.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.showMessage(`Error Updating Site: ${site.get('name')}`));
  }

  showMessage(messageText) {
    this.setState({ messageShow: true, messageText });
  }

  handleMessageClose() {
    this.setState({ messageShow: false });
  }

  renderConfig(site, config) {
    const { modules, apicalls } = this.state;
    if (!modules || !apicalls) {
      return undefined;
    }
    switch (config) {
      case 'departments':
        return (
          <DepartmentAdmin
            site={site}
            modules={modules}
            apicalls={apicalls}
            fetchHierarchy={this.props.fetchHierarchy}
            message={this.showMessage}
          />
        );
      case 'machines':
        return (
          <MachineAdmin
            site={site}
            modules={modules}
            fetchHierarchy={this.props.fetchHierarchy}
            message={this.showMessage}
          />
        );
      default:
        return <ConfigurationForm site={site} submitForm={this.updateSite} modules={modules} />;
    }
  }

  render() {
    const { site, splat, navigate } = this.props;
    return (
      <div className="admin__site-container">
        <div className="admin__site-sidebar">
          <div className="admin__site-title">
            <CardTitle
              title={`${site.get('name')} - ${site.get('code')}`}
              subtitle={site.get('location')}
            />
          </div>
          <div className="admin__site-options">
            <List>
              <ListItem
                onClick={() => navigate('')}
                primaryText="Configuration"
                leftIcon={<Settings />}
              />
              <ListItem
                onClick={() => navigate('departments')}
                primaryText="Departments"
                leftIcon={<Business />}
              />
              <ListItem
                onClick={() => navigate('machines')}
                primaryText="Machines"
                leftIcon={<Router />}
              />
            </List>
          </div>
        </div>
        <div className={`admin__site-content admin__site-content-${getConfigName(site, splat)}`}>
          {this.renderConfig(site, getConfigName(site, splat))}
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

AdminSite.propTypes = {
  fetchHierarchy: PropTypes.func.isRequired,
  navigate: PropTypes.func,
  site: PropTypes.object,
  splat: PropTypes.string,
};

export default AdminSite;
