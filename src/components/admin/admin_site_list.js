import React from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';

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
  </List>
);

export default AdminSiteList;
