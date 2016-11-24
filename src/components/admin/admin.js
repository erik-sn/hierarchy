import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader } from 'material-ui/Card';
import Lock from 'material-ui/svg-icons/action/lock';
import { is } from 'immutable';

import AdminTabs from './admin_tabs';
import AdminHierarchy from './admin_hierarchy';
import Modules from './admin_module';
import { fetchHierarchy } from '../../actions/api';
import { buildNavigate } from '../../utils/resolver';

const navigate = buildNavigate('/admin');

export class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeMenu: props.params.menu || 'hierarchy',
    };
  }

  componentDidMount() {
    this.props.fetchHierarchy('?inactive=true');
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
      case 'modules':
        return <Modules key={Math.random()} />;
      default:
        return <AdminHierarchy splat={splat} sites={this.props.sites} />;
    }
  }

  render() {
    if (!this.props.user.get('admin')) {
      return (
        <div className="admin__message">
          <Lock style={{ height: '200px', width: '200px' }} />
          <h3>You are not authorized to view this section</h3>
        </div>
      );
    }
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
        <AdminTabs navigate={navigate} value={this.props.params.menu} />
        {this.renderMenu()}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.get('auth').get('user'),
    hierarchy: state.get('hierarchy').get('sites'),
  };
}

export default connect(mapStateToProps, { fetchHierarchy })(Admin);
