import * as axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Add from 'material-ui/svg-icons/content/add';
import * as React from 'react';

import types from '../../actions/types';
import Modal from '../modal';
import SiteForm from './forms/site_form';

import { ISite } from '../../constants/interfaces';


export interface IAdminSiteListProps {
  fetchHierarchy: Function;
  navigate: Function;
  sites: ISite[];
}

export interface IAdminSiteListState {
  showNewSiteForm: boolean;
  messageText: string;
  messageShow: boolean;
}

class AdminSiteList extends React.Component<IAdminSiteListProps, IAdminSiteListState> {

  constructor(props: IAdminSiteListProps) {
    super(props);
    this.state = {
      showNewSiteForm: false,
      messageText: '',
      messageShow: false,
    };
    this.toggleShowNewSiteForm = this.toggleShowNewSiteForm.bind(this);
    this.createSite = this.createSite.bind(this);
  }

  public toggleShowNewSiteForm() {
    this.setState({ showNewSiteForm: !this.state.showNewSiteForm });
  }

  public createSite(site: ISite) {
    axios.post(`${types.API}/sites/`, site, types.API_CONFIG)
    .then(() => this.setState({
      messageShow: true,
      messageText: `Site Successfully Created: ${site.name}`,
    }))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.setState({
      messageShow: true,
      messageText: `Error Creating Site: ${site.name}`,
    }));
    this.toggleShowNewSiteForm();
  }

  public renderNewSiteModal(): JSX.Element {
    return (
      <Modal
        title="Create New Site"
        onCancel={this.toggleShowNewSiteForm}
      >
        <SiteForm submitForm={this.createSite} />
      </Modal>
    );
  }

  public renderSiteList(): JSX.Element[] {
    return this.props.sites.map((site, i) => {
      const handleSiteClick = () => this.props.navigate(site.code);
      return (
        <ListItem
          key={i}
          onClick={handleSiteClick}
          primaryText={`${site.name} - ${site.code}`}
          secondaryText={site.location}
        />
      );
    });
  }

  public render() {
    const { sites } = this.props;
    return (
      <div className="admin__site-list-container">
        {this.state.showNewSiteForm ? this.renderNewSiteModal() : undefined}
        <List>
          {this.renderSiteList()}
          <FlatButton
            onClick={this.toggleShowNewSiteForm}
            label="Add Site"
            icon={<Add />}
            primary
          />
        </List>
      </div>
    );
  }
}

export default AdminSiteList;
