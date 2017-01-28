import * as axios from 'axios';
import { CardTitle } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Settings from 'material-ui/svg-icons/action/settings';
import Business from 'material-ui/svg-icons/communication/business';
import Router from 'material-ui/svg-icons/hardware/router';
import * as React from 'react';

import types from '../../actions/types';
import DepartmentAdmin from './admin_department';
import MachineAdmin from './admin_machine';
import SiteForm from './forms/site_form';

import { IApiCall, IAxiosResponse, IModule, ISite } from '../../constants/interfaces';

const getConfigName = (site: ISite, splat: string) => {
  const siteCode = site.code.toLowerCase();
  return splat.replace(`/${siteCode}`, '').replace('/', '');
};

export interface IAdminSiteState {
  messageText: string;
  messageShow: boolean;
  apicalls: IApiCall[];
  modules: IModule[];
}

export interface IAdminSiteProps {
  fetchHierarchy: () => void;
  navigate: (destination: string) => void;
  site: ISite;
  splat: string;
}


class AdminSite extends React.Component<IAdminSiteProps, IAdminSiteState> {

  constructor(props: IAdminSiteProps) {
    super(props);
    this.state = {
      messageText: '',
      messageShow: false,
      apicalls: undefined,
      modules: undefined,
    };
    this.updateSite = this.updateSite.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.configClick = this.configClick.bind(this);
    this.departmentClick = this.departmentClick.bind(this);
    this.machineClick = this.machineClick.bind(this);
  }

  public componentDidMount() {
    axios.get(`${types.API}/modules/`, types.API_CONFIG)
    .then((response: IAxiosResponse) => this.setState({
      modules: response.data as IModule[],
    }))
    .catch(() => this.showMessage('Error Loading Modules'));


    axios.get(`${types.API}/apicalls/`, types.API_CONFIG)
    .then((response: IAxiosResponse) => this.setState({
      apicalls: response.data as IApiCall[],
    }))
    .catch(() => this.showMessage('Error Loading Api Calls'));
  }

  public updateSite(site: ISite) {
    const url = `${types.API}/sites/${site.id}/`;
    axios.put(url, site, types.API_CONFIG)
    .then(() => this.showMessage(`Site Successfully Updated: ${site.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.showMessage(`Error Updating Site: ${site.name}`));
  }

  public showMessage(messageText: string) {
    this.setState({ messageShow: true, messageText });
  }

  public handleMessageClose() {
    this.setState({ messageShow: false });
  }

  public renderConfig(site: ISite, config: string) {
    const { modules, apicalls } = this.state;
    if (!modules || !apicalls) {
      return undefined;
    }
    switch (config) {
      case 'departments':
        return (
          <DepartmentAdmin
            site={site}
            modules={modules}
            apicalls={apicalls}
            fetchHierarchy={this.props.fetchHierarchy}
            message={this.showMessage}
          />
        );
      case 'machines':
        return (
          <MachineAdmin
            site={site}
            modules={modules}
            fetchHierarchy={this.props.fetchHierarchy}
            message={this.showMessage}
          />
        );
      default:
        return <SiteForm site={site} submitForm={this.updateSite} modules={modules} />;
    }
  }

  public configClick() {
    this.props.navigate('');
  }

  public departmentClick() {
    this.props.navigate('departments');
  }

  public machineClick() {
    this.props.navigate('machines');
  }

  public render() {
    const { site, splat, navigate } = this.props;


    return (
      <div className="admin__site-container">
        <div className="admin__site-sidebar">
          <div className="admin__site-title">
            <CardTitle
              title={`${site.name} - ${site.name}`}
              subtitle={site.location}
            />
          </div>
          <div className="admin__site-options">
            <List>
              <ListItem
                onClick={this.configClick}
                primaryText="Configuration"
                leftIcon={<Settings />}
              />
              <ListItem
                onClick={this.departmentClick}
                primaryText="Departments"
                leftIcon={<Business />}
              />
              <ListItem
                onClick={this.machineClick}
                primaryText="Machines"
                leftIcon={<Router />}
              />
            </List>
          </div>
        </div>
        <div className={`admin__site-content admin__site-content-${getConfigName(site, splat)}`}>
          {this.renderConfig(site, getConfigName(site, splat))}
        </div>
        <Snackbar
          open={this.state.messageShow}
          message={this.state.messageText}
          action="Ok"
          autoHideDuration={10000}
          onActionTouchTap={this.handleMessageClose}
          onRequestClose={this.handleMessageClose}
        />
      </div>
    );
  }
}


export default AdminSite;
