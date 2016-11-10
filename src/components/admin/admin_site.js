import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ContentSend from 'material-ui/svg-icons/content/send';
import ActionGrade from 'material-ui/svg-icons/action/grade';

const AdminSite = ({ site }) => (
  <div className="admin__site-container">
    <div className="admin__site-sidebar">
      <div className="admin__site-title">
        <CardTitle
          title={`${site.get('name')} - ${site.get('code')}`}
          subtitle={site.get('location')}
        />
      </div>
      <div className="admin__site-options">
        <List>
          <ListItem
            primaryText="Site Options"
            leftIcon={<ContentSend />}
            nestedItems={[
              <ListItem
                key={1}
                primaryText="Starred"
                leftIcon={<ActionGrade />}
              />,
              <ListItem
                key={2}
                primaryText="Starred"
                leftIcon={<ActionGrade />}
              />,
              <ListItem
                key={3}
                primaryText="Starred"
                leftIcon={<ActionGrade />}
              />,
            ]}
          />
        </List>
      </div>
    </div>
    <div className="admin__site-content">
      <h3>do stuff here</h3>
    </div>
  </div>
);

export default AdminSite;
