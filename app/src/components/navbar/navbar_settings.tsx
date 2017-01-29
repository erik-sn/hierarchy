
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AboutIcon from 'material-ui/svg-icons/action/help-outline';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import SecurityICon from 'material-ui/svg-icons/hardware/security';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import * as React from 'react';
import { Link } from 'react-router';

export interface ISettingsProps {
  admin: string;
  settings: string;
  about: string;
  help: string;
}

const Settings = ({settings, admin, help, about}: ISettingsProps): JSX.Element => (
  <IconMenu
    iconButtonElement={<IconButton><MoreVertIcon color="whitesmoke" /></IconButton>}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <Link to={settings} >
      <MenuItem
        primaryText="Settings"
        leftIcon={<SettingsIcon />}
      />
    </Link>
    <Link to={admin} >
      <MenuItem
        primaryText="Admin"
        leftIcon={<SecurityICon />}
      />
    </Link>
    <Link to={help} >
      <MenuItem
        primaryText="Help"
        leftIcon={<AboutIcon />}
      />
    </Link>
    <Link to={about} >
      <MenuItem
        primaryText="About"
        leftIcon={<InfoIcon />}
      />
    </Link>
  </IconMenu>
);

export default Settings;
