import React, { Component } from 'react';
import axios from 'axios';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';

import types from '../../actions/types';
import Modal from '../modal';
import ConfigurationForm from './forms/admin_configuration';

class AdminSiteList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNewSiteForm: false,
      messageText: '',
      messageShow: false,
    };
    this.toggleShowNewSiteForm = this.toggleShowNewSiteForm.bind(this);
    this.createSite = this.createSite.bind(this);
  }

  toggleShowNewSiteForm() {
    this.setState({ showNewSiteForm: !this.state.showNewSiteForm });
  }

  createSite(site) {
    axios.post(`${types.API}/sites/`, site, types.API_CONFIG)
    .then(() => this.setState({
      messageShow: true,
      messageText: 'Site Successfully Created',
    }))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.setState({
      messageShow: true,
      messageText: 'Error Updating Site',
    }));
    this.toggleShowNewSiteForm();
  }

  renderNewSiteModal() {
    return (
      <Modal
        title="Create New Site"
        onCancel={this.toggleShowNewSiteForm}
      >
        <ConfigurationForm
          submitForm={this.createSite}
          modal
          new
        />
      </Modal>
    );
  }
  render() {
    const { sites, navigate } = this.props;
    return (
      <div className="admin__site-list-container">
        {this.state.showNewSiteForm ? this.renderNewSiteModal() : undefined}
        <List>
          {sites.map((site, i) => (
            <ListItem
              key={i}
              onClick={() => navigate(site.get('code'))}
              primaryText={`${site.get('name')} - ${site.get('code')}`}
              secondaryText={site.get('location')}
            />
          ))}
          <FlatButton
            onClick={this.toggleShowNewSiteForm}
            label="Add Site"
            icon={<Add />}
            primary
          />
        </List>
      </div>
    );
  }
}

export default AdminSiteList;
