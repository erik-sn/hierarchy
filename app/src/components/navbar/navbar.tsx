import * as React from 'react';
import { Link } from 'react-router';

import { IAppConfig, IDepartment, IHierarchyTier, IMachine, ISite, IUser } from '../../constants/interfaces';
import getBoundingBox from '../../utils/dom';
import { alphaNumSort } from '../../utils/sort';
import Neighbor from './navbar_neighbor';
import Settings from './navbar_settings';


interface IHierarchy {
  site: ISite;
  department: IDepartment;
  machine: IMachine;
}

export interface INavbarProps {
  config: IAppConfig;
  hierarchy: IHierarchy;
  path: string;
  user: IUser;
  sites: ISite[];
}

export interface INavbarState {
  dropdownX: number;
  dropdownY: number;
  dropdownContainer: JSX.Element;
}

class Navbar extends React.Component<INavbarProps, INavbarState> {

  constructor(props: INavbarProps) {
    super(props);
    this.state = {
      dropdownX: undefined,
      dropdownY: undefined,
      dropdownContainer: undefined,
    };
    this.hideNeighbors = this.hideNeighbors.bind(this);
  }

  public componentDidMount() {
    window.addEventListener('resize', this.hideNeighbors);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.path !== this.props.path) {
  //     return true;
  //   }
  //   if ((!nextState.dropdownContainer && this.state.dropdownContainer) ||
  //       (nextState.dropdownContainer && !this.state.dropdownContainer)) {
  //     return true;
  //   }
  //   return !is(this.props.hierarchy, nextProps.hierarchy);
  // }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.hideNeighbors);
  }

  public hideNeighbors() {
    this.setState({
      dropdownX: undefined,
      dropdownY: undefined,
      dropdownContainer: undefined,
    });
  }

  public renderNeighbors(path: string, neighbors: string[]): JSX.Element[] {
    return neighbors.sort(alphaNumSort).map((name, i) => (
      <Neighbor path={path} hide={this.hideNeighbors} key={i} name={name} />
    ));
  }

  public showNeighbors(e: React.MouseEvent<{}>, neighbors: string[]) {
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
    const height = neighbors.length * 40;
    const neighborContainerStyle = {
      left: `${Math.round(windowWidth - dropdownX - 215 <= 0 ? windowWidth - 240 : dropdownX)}`,
      top: `${Math.round(windowWidth < 970 ? dropdownY + 15 : dropdownY + 10)}`,
      height: `${height <= 400 ? height : 400}`,
    };
    const dropdownContainer = (
      <div
        className="navbar__neighbor-container"
        style={neighborContainerStyle}
      >
        <div className="navbar__neighbor-list">
          {this.renderNeighbors(path, neighbors)}
        </div>
      </div>
    );
    this.setState({ dropdownX, dropdownY, dropdownContainer });
  }

  public renderSiteNav(hierarchyTier: IHierarchyTier, last: IHierarchyTier, to: string, neighbors: string[]) {
    if (hierarchyTier.name === last.name) {
      const handleClick = (e: React.MouseEvent<{}>) => this.showNeighbors(e, neighbors);
      return (
        <div
          role="button"
          className="navbar__hierarchy-item-parent navbar__hierarchy-item-last"
        >
          <div className="navbar__chain-container" />
          <div
            className="navbar__hierarchy-item-child"
            onClick={handleClick}
          >
            {hierarchyTier.name}
          </div>
        </div>
      );
    }
    return (
      <div className="navbar__hierarchy-item-parent" >
        <div className="navbar__chain-container" />
        <Link to={to.toLowerCase()} onClick={this.hideNeighbors}>
          <div className="navbar__hierarchy-item-child">{hierarchyTier.name}</div>
        </Link>
      </div>
    );
  }

  public render() {
    const { sites, user, hierarchy, config }: INavbarProps = this.props;
    const name = !user || !user.username ? '' : user.username;
    const site = hierarchy ? hierarchy.site : undefined;

    const department = hierarchy ? hierarchy.department : undefined;
    const machine = hierarchy ? hierarchy.machine : undefined;
    const last = machine || department || site;  // determine depth of hiearchy

    const siteTo = site ? `/${site.code}` : '';
    const departmentTo = department ? `/${site.code}/${department.name}` : '';
    const machineTo = machine ? `/${site.code}/${department.name}/${machine.name}` : '';

    const siteNeighbors = sites ? sites.map((s) => s.code) : undefined;
    const departmentNeighbors = site ? site.departments.map((dpt) => dpt.name) : undefined;
    const machineNeighbors = department ? department.machines.map((mch) => mch.name) : undefined;

    return (
      <header className="navbar__container">
        {this.state.dropdownContainer}
        <Link to="/" onClick={this.hideNeighbors} >
          <div className="navbar__icon-container">
            <img alt="Logo" className="nav-bar-logo" src="/processworkshop/static/media/logo.png" height="40px" />
          </div>
        </Link>
        <Link to="/" onClick={this.hideNeighbors}>
          <div className="navbar__app-label">{config.name}</div>
        </Link>
        <nav className="navbar__hierarchy-container">
          <div className="navbar__hierarchy-item-holder">
            <div className="navbar__hierarchy-item-child" />
          </div>
          {site ? this.renderSiteNav(site, last, siteTo, siteNeighbors) : ''}
          {department ? this.renderSiteNav(department, last, departmentTo, departmentNeighbors) : ''}
          {machine ? this.renderSiteNav(machine, last, machineTo, machineNeighbors) : ''}
        </nav>
        <div className="navbar__info-container">
          <div className="navbar__username" >{name}</div>
          <div className="navbar__settings" >
            <Settings admin="/admin" settings="/settings" about="/about" help="/help" />
          </div>
        </div>
      </header>
    );
  }
}

export default Navbar;
