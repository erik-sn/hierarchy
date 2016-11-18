import React from 'react';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';

const AdminSiteList = ({ sites, navigate }) => (
  <List className="admin__site-list-container">
    {sites.map((site, i) => (
      <ListItem
        key={i}
        onClick={() => navigate(site.get('code'))}
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
