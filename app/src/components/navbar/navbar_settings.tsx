
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AboutIcon from 'material-ui/svg-icons/action/help-outline';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import SecurityICon from 'material-ui/svg-icons/hardware/security';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import * as React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

export interface ISettingsProps {
  admin: string;
  settings: string;
  about: string;
  help: string;
}

const toSettings = () => browserHistory.push('settings');
const toAdmin = () => browserHistory.push('admin');
const toHelp = () => browserHistory.push('help');
const toAbout = () => browserHistory.push('about');

const Settings = ({settings, admin, help, about}: ISettingsProps): JSX.Element => (
  <IconMenu
    iconButtonElement={<IconButton><MoreVertIcon color="whitesmoke" /></IconButton>}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem
      onClick={toSettings}
      primaryText="Settings"
      leftIcon={<SettingsIcon />}
    />
    <MenuItem
      onClick={toAdmin}
      primaryText="Admin"
      leftIcon={<SecurityICon />}
    />
    <MenuItem
      onClick={toHelp}
      primaryText="Help"
      leftIcon={<AboutIcon />}
    />
    <MenuItem
      onClick={toAbout}
      primaryText="About"
      leftIcon={<InfoIcon />}
    />
  </IconMenu>
);

export default Settings;
