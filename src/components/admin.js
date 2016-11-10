import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export const Admin = () => (
  <Card 
    className="admin__container"
    containerStyle={{ width: '100%' }}
  >
    <CardHeader
      title="Admin"
      subtitle="Application administration menu"
    />
    <CardText>
      <div>Sites</div>
      <div>Departments</div>
      <div>Machines</div>
      <div>Modules</div>
      <div>Positions</div>
      <div>Specifications</div>
    </CardText>
  </Card>
);

const AdminContainer = Admin;
export default AdminContainer;
