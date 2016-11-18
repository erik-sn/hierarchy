import React from 'react';
import { CardTitle } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Settings from 'material-ui/svg-icons/action/settings';
import Business from 'material-ui/svg-icons/communication/business';
import Router from 'material-ui/svg-icons/hardware/router';

import ConfigurationForm from './forms/admin_configuration';
import DepartmentForm from './forms/admin_departments';
import MachineForm from './forms/admin_machines';

const renderConfig = (site, config) => {
  switch (config) {
    case 'departments':
      return <DepartmentForm site={site} />;
    case 'machines':
      return <MachineForm site={site} />;
    default:
      return <ConfigurationForm site={site} />;
  }
};

const getConfigName = (site, splat) => {
  const siteCode = site.get('code').toLowerCase();
  return splat.replace(`/${siteCode}`.toLowerCase(), '').replace('/', '');
};

const AdminSite = ({ site, splat, navigate }) => (
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
      {renderConfig(site, getConfigName(site, splat))}
    </div>
  </div>
);

export default AdminSite;
