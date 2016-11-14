import React from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';

const AdminSiteList = props => (
  <List>
    {props.sites.map((site, i) => (
      <ListItem
        key={i}
        onClick={() => browserHistory.push(`/admin/hierarchy/${site.get('code').toLowerCase()}/`)}
        primaryText={`${site.get('name')} - ${site.get('code')}`}
        secondaryText={site.get('location')}
      />
    ))}
    <FlatButton
      label="Add Site"
      icon={<Add />}
      primary
    />
  </List>
);

export default AdminSiteList;
