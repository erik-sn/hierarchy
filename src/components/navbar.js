import React, { Component } from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { is } from 'immutable';

import { getBoundingBox } from '../utils/dom';
import { alphaNumSort } from '../utils/sort';

const Neighbor = (props) => {
  const { path, hide, name } = props;
  const rootIndex = path ? path.lastIndexOf('/') + 1 : 0;
  const newPath = path ? path.substring(0, rootIndex) + name.toLowerCase() : '';
  return (
    <Link to={newPath} onClick={hide} >
      <MenuItem className="navbar__neighbor-item" value={name} primaryText={name} />
    </Link>
  );
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
    window.addEventListener('resize', () => {
      this.hideNeighbors();
    });
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
    window.removeEventListener('resize');
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
    const { dropdownX, dropdownY, windowWidth, elementWidth } = getBoundingBox(e);
    const dropdownContainer = (
      <Paper
        className="navbar__neighbor-container"
        style={{
          left: windowWidth < 970 ? dropdownX : dropdownX + 20,
          top: windowWidth < 970 ? dropdownY - 2 : dropdownY - 4,
          width: elementWidth < 150 ? 150 : elementWidth,
        }}
      >
        <Menu>
          {neighbors.sort(alphaNumSort).map((name, i) => (
            <Neighbor path={path} hide={this.hideNeighbors} key={i} name={name} />
          ))}
        </Menu>
      </Paper>
    );
    this.setState({ dropdownX, dropdownY, dropdownContainer });
  }

  renderSiteNav(component, last, to, neighbors) {
    if (component.get('name') === last.get('name')) {
      return (
        <div
          role="button"
          className="navbar__hierarchy-item-parent"
          onClick={e => this.showNeighbors(e, neighbors)}
        >
          <div className="navbar__hierarchy-item-child">{component.get('name')}</div>
        </div>
      );
    }
    return (
      <Link to={to.toLowerCase()} onClick={this.hideNeighbors}>
        <div className="navbar__hierarchy-item-parent" >
          <div className="navbar__hierarchy-item-child">{component.get('name')}</div>
        </div>
      </Link>
    );
  }

  render() {
    const { user, hierarchy } = this.props;
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
          <div className="navbar__app-label">process workshop</div>
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
            <img src="/static/media/settings.svg" alt="settings" />
          </div>
        </div>
      </header>
    );
  }
}

export default Navbar;

