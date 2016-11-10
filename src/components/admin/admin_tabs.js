import React from 'react';
import { browserHistory } from 'react-router';

import { Tabs, Tab } from 'material-ui/Tabs';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import Lock from 'material-ui/svg-icons/action/lock';
import Assignment from 'material-ui/svg-icons/action/assignment-turned-in';

const AdminTabs = () => (
  <Tabs>
    <Tab
      onClick={() => browserHistory.push('/admin/hierarchy')}
      className="admin__menu-tab"
      icon={<DeviceHub />}
      label="hierarchy"
    />
    <Tab
      onClick={() => browserHistory.push('/admin/specifications')}
      className="admin__menu-tab"
      icon={<Assignment />}
      label="specifications"
    />
    <Tab
      onClick={() => browserHistory.push('/admin/permissions')}
      className="admin__menu-tab"
      icon={<Lock />}
      label="permissions"
    />
  </Tabs>
);

export default AdminTabs;
