import React, { Component } from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import { is } from 'immutable';

import Modal from '../modal';
import AdminTabs from './admin_tabs';
import AdminHierarchy from './admin_hierarchy';

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeMenu: props.params.menu || 'hierarchy',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (is(this.props.hierarchy, nextProps.hierarchy)) {
      return true;
    } else if (this.props.params.menu !== nextProps.params.menu) {
      return true;
    } else if (this.state.activeMenu !== nextState.activeMenu) {
      return true;
    }
    return false;
  }

  renderMenu() {
    const { menu, splat } = this.props.params;
    switch (menu) {
      case 'hierarchy':
        return <AdminHierarchy splat={splat} sites={this.props.sites} />;
      case 'specifications':
        return <div>specification</div>;
      case 'permissions':
        return <div>Permissions</div>;
      default:
        return (
          <Modal
            title="Error"
            error
            message={`There was an error retrieving the admin menu - 
              please refresh the page or contact the administrator`}
          />
        );
    }
  }

  render() {
    return (
      <Card
        className="admin__container"
      >
        <CardHeader
          titleStyle={{ fontSize: '1.75rem' }}
          subtitleStyle={{ fontSize: '1.15rem' }}
          className="admin__header"
          title="Admin"
          subtitle="Application administration menu"
        />
        <AdminTabs activeMenu={this.state.activeMenu} changeMenu={this.changeMenu} />
        {this.renderMenu()}
      </Card>
    );
  }
}

export default Admin;
