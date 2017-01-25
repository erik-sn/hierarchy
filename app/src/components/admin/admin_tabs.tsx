import * as React from 'react';

import Lock from 'material-ui/svg-icons/action/lock';
import Antenna from 'material-ui/svg-icons/action/settings-input-antenna';
import Module from 'material-ui/svg-icons/action/view-module';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import { Tab, Tabs } from 'material-ui/Tabs';

export interface IAdminTabsProps {
  navigate: (destination: string) => void;
  value: string;
}


const AdminTabs = ({ navigate, value }: IAdminTabsProps) => {
  const navigateHierarchy = () => navigate('hierarchy');
  const navigateModules = () => navigate('modules');
  const navigateApiCalls = () => navigate('apicalls');
  const navigatePermissions = () => navigate('permissions');
  return (
    <Tabs value={value} >
      <Tab
        onClick={navigateHierarchy}
        className="admin__menu-tab"
        icon={<DeviceHub />}
        label="hierarchy"
        value="hierarchy"
      />
      <Tab
        onClick={navigateModules}
        className="admin__menu-tab"
        icon={<Module />}
        label="modules"
        value="modules"
      />
      <Tab
        onClick={navigateApiCalls}
        className="admin__menu-tab"
        icon={<Antenna />}
        label="api calls"
        value="apicalls"
      />
      <Tab
        onClick={navigatePermissions}
        className="admin__menu-tab"
        icon={<Lock />}
        label="permissions"
        value="permissions"
      />
    </Tabs>
  );
};

export default AdminTabs;
