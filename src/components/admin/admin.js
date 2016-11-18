import React, { Component } from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import { is } from 'immutable';

import AdminTabs from './admin_tabs';
import AdminHierarchy from './admin_hierarchy';
import { buildNavigate } from '../../utils/resolver';

const navigate = buildNavigate('/admin');

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeMenu: props.params.menu || 'hierarchy',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!is(this.props.hierarchy, nextProps.hierarchy)) {
      return true;
    } else if (this.props.params.menu !== nextProps.params.menu) {
      return true;
    } else if (this.props.params.splat !== nextProps.params.splat) {
      return true;
    } else if (this.state.activeMenu !== nextState.activeMenu) {
      return true;
    }
    return false;
  }

  renderMenu() {
    const { menu, splat } = this.props.params;
    switch (menu) {
      case 'specifications':
        return <div className="admin__specifications">specification</div>;
      case 'permissions':
        return <div className="admin__permissions">Permissions</div>;
      default:
        return <AdminHierarchy splat={splat} sites={this.props.sites} />;
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
        <AdminTabs navigate={navigate} />
        {this.renderMenu()}
      </Card>
    );
  }
}

export default Admin;
