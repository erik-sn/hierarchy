import React from 'react';
import { browserHistory } from 'react-router';
import { CardTitle } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Settings from 'material-ui/svg-icons/action/settings';
import Business from 'material-ui/svg-icons/communication/business';
import Router from 'material-ui/svg-icons/hardware/router';

import ConfigurationForm from './forms/admin_configuration';
import DepartmentForm from './forms/admin_departments';
import MachineForm from './forms/admin_machines';

const ROOT = '/admin/hierarchy';

const getConfig = (site, config) => {
  switch (config) {
    case 'departments':
      return <DepartmentForm site={site} />;
    case 'machines':
      return <MachineForm site={site} />;
    default:
      return <ConfigurationForm site={site} />;
  }
};

const renderConfig = (site, splat) => {
  const siteCode = site.get('code').toLowerCase();
  const config = splat.replace(`/${siteCode}`.toLowerCase(), '').replace('/', '');
  return getConfig(site, config);
};

const AdminSite = ({ site, splat }) => (
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
            onClick={() => browserHistory.push(`${ROOT}/${site.get('code')}/`.toLowerCase())}
            primaryText="Configuration"
            leftIcon={<Settings />}
          />
          <ListItem
            onClick={() => browserHistory.push(`${ROOT}/${site.get('code')}/departments/`.toLowerCase())}
            primaryText="Departments"
            leftIcon={<Business />}
          />
          <ListItem
            onClick={() => browserHistory.push(`${ROOT}/${site.get('code')}/machines/`.toLowerCase())}
            primaryText="Machines"
            leftIcon={<Router />}
          />
        </List>
      </div>
    </div>
    <div className="admin__site-content">
      {renderConfig(site, splat)}
    </div>
  </div>
);

export default AdminSite;
