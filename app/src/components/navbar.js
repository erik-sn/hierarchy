import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AboutIcon from 'material-ui/svg-icons/action/help-outline';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import SecurityICon from 'material-ui/svg-icons/hardware/security';
import { is } from 'immutable';

import getBoundingBox from '../utils/dom';
import { alphaNumSort } from '../utils/sort';

export const Neighbor = (props) => {
  const { path, hide, name } = props;
  const rootIndex = path ? path.lastIndexOf('/') + 1 : 0;
  const newPath = path ? path.substring(0, rootIndex) + name.toLowerCase() : '';
  return (
    <Link to={newPath} onClick={hide} >
      <div className="host__label-small navbar__neighbor-item">{name}</div>
    </Link>
  );
};

Neighbor.propTypes = {
  path: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export const Settings = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon color="whitesmoke" /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <Link to={props.settings} >
      <MenuItem
        primaryText="Settings"
        leftIcon={<SettingsIcon />}
      />
    </Link>
    <Link to={props.admin} >
      <MenuItem
        primaryText="Admin"
        leftIcon={<SecurityICon />}
      />
    </Link>
    <Link to={props.help} >
      <MenuItem
        primaryText="Help"
        leftIcon={<AboutIcon />}
      />
    </Link>
    <Link to={props.about} >
      <MenuItem
        primaryText="About"
        leftIcon={<InfoIcon />}
      />
    </Link>
  </IconMenu>
);

Settings.propTypes = {
  admin: PropTypes.string.isRequired,
  settings: PropTypes.string.isRequired,
  about: PropTypes.string,
  help: PropTypes.string,
};

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownX: undefined,
      dropdownY: undefined,
      dropdownContainer: undefined,
    };
    this.hideNeighbors = this.hideNeighbors.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.hideNeighbors);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.path !== this.props.path) {
      return true;
    }
    if ((!nextState.dropdownContainer && this.state.dropdownContainer) ||
        (nextState.dropdownContainer && !this.state.dropdownContainer)) {
      return true;
    }
    return !is(this.props.hierarchy, nextProps.hierarchy);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.hideNeighbors);
  }

  hideNeighbors() {
    this.setState({
      dropdownX: undefined,
      dropdownY: undefined,
      dropdownContainer: undefined,
    });
  }

  showNeighbors(e, neighbors) {
    // hide niehbors if they are currently shown
    if (this.state.dropdownContainer) {
      this.hideNeighbors();
      return;
    }
    if (!neighbors) {
      return;
    }
    const { path } = this.props;
    const { dropdownX, dropdownY, windowWidth } = getBoundingBox(e);
    const height = neighbors.size * 40;
    const dropdownContainer = (
      <div
        className="navbar__neighbor-container"
        style={{
          left: windowWidth - dropdownX - 215 <= 0 ? windowWidth - 240 : dropdownX,
          top: windowWidth < 970 ? dropdownY + 15 : dropdownY + 10,
          height: height <= 400 ? height : 400,
        }}
      >
        <div className="navbar__neighbor-list">
          {neighbors.sort(alphaNumSort).map((name, i) => (
            <Neighbor path={path} hide={this.hideNeighbors} key={i} name={name} />
          ))}
        </div>
      </div>
    );
    this.setState({ dropdownX, dropdownY, dropdownContainer });
  }

  renderSiteNav(component, last, to, neighbors) {
    if (component.get('name') === last.get('name')) {
      return (
        <div
          role="button"
          className="navbar__hierarchy-item-parent navbar__hierarchy-item-last"
        >
          <div className="navbar__chain-container" />
          <div
            className="navbar__hierarchy-item-child"
            onClick={e => this.showNeighbors(e, neighbors)}
          >
            {component.get('name')}
          </div>
        </div>
      );
    }
    return (
      <div className="navbar__hierarchy-item-parent" >
        <div className="navbar__chain-container" />
        <Link to={to.toLowerCase()} onClick={this.hideNeighbors}>
          <div className="navbar__hierarchy-item-child">{component.get('name')}</div>
        </Link>
      </div>
    );
  }

  render() {
    const { user, hierarchy, config } = this.props;
    const name = !user || !user.get('username') ? '' : user.get('username');
    const site = hierarchy ? hierarchy.get('site') : undefined;

    const department = hierarchy ? hierarchy.get('department') : undefined;
    const machine = hierarchy ? hierarchy.get('machine') : undefined;
    const last = machine || department || site;  // determine depth of hiearchy

    const siteTo = site ? `/${site.get('code')}` : '';
    const departmentTo = department ? `/${site.get('code')}/${department.get('name')}` : '';
    const machineTo = machine ? `/${site.get('code')}/${department.get('name')}/${machine.get('name')}` : '';

    const departmentNeighbors = site ? site.get('departments').map(dpt => dpt.get('name')) : undefined;
    const machineNeighbors = department ? department.get('machines').map(mch => mch.get('name')) : undefined;

    return (
      <header className="navbar__container">
        {this.state.dropdownContainer}
        <Link to="/" onClick={this.hideNeighbors} >
          <div className="navbar__icon-container">
            <img alt="Logo" className="nav-bar-logo" src="/static/media/logo.png" height="40px" />
          </div>
        </Link>
        <Link to="/" onClick={this.hideNeighbors}>
          <div className="navbar__app-label">{config.get('name')}</div>
        </Link>
        <nav className="navbar__hierarchy-container">
          <div className="navbar__hierarchy-item-holder">
            <div className="navbar__hierarchy-item-child" />
          </div>
          {site ? this.renderSiteNav(site, last, siteTo, undefined) : ''}
          {department ? this.renderSiteNav(department, last, departmentTo, departmentNeighbors) : ''}
          {machine ? this.renderSiteNav(machine, last, machineTo, machineNeighbors) : ''}
        </nav>
        <div className="navbar__info-container">
          <div className="navbar__username" >{name}</div>
          <div className="navbar__settings" >
            <Settings admin="/admin" settings="/settings" about="/about" />
          </div>
        </div>
      </header>
    );
  }
}

Navbar.propTypes = {
  config: PropTypes.object.isRequired,
  hierarchy: PropTypes.object,
  path: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default Navbar;
