import * as React from 'react';

import Antenna from 'material-ui/svg-icons/action/settings-input-antenna';
import Module from 'material-ui/svg-icons/action/view-module';
import DeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import { Tab, Tabs } from 'material-ui/Tabs';

export interface IAdminTabsProps {
  navigate: (destination: string) => void;
  value: string;
}

/**
 * Generate a navigational bar that allows the user to navigate to
 * each of the major configuration tools
 */
const AdminTabs = ({ navigate, value }: IAdminTabsProps) => {
  const navigateHierarchy = () => navigate('hierarchy');
  const navigateModules = () => navigate('modules');
  const navigateApiCalls = () => navigate('apicalls');
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
    </Tabs>
  );
};

export default AdminTabs;
