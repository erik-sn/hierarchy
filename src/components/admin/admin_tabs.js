import React, { PropTypes } from 'react';

import { Tabs, Tab } from 'material-ui/Tabs';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import Lock from 'material-ui/svg-icons/action/lock';
import Antenna from 'material-ui/svg-icons/action/settings-input-antenna';
import Module from 'material-ui/svg-icons/action/view-module';


const AdminTabs = ({ navigate, value }) => (
  <Tabs value={value} >
    <Tab
      onClick={() => navigate('hierarchy')}
      className="admin__menu-tab"
      icon={<DeviceHub />}
      label="hierarchy"
      value="hierarchy"
    />
    <Tab
      onClick={() => navigate('modules')}
      className="admin__menu-tab"
      icon={<Module />}
      label="modules"
      value="modules"
    />
    <Tab
      onClick={() => navigate('apicalls')}
      className="admin__menu-tab"
      icon={<Antenna />}
      label="api calls"
      value="apicalls"
    />
    <Tab
      onClick={() => navigate('permissions')}
      className="admin__menu-tab"
      icon={<Lock />}
      label="permissions"
      value="permissions"
    />
  </Tabs>
);

AdminTabs.propTypes = {
  navigate: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default AdminTabs;
