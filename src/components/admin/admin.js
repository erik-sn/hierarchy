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

/**
 * General admin controller element
 * 
 * @export
 * @class Admin
 * @extends {Component}
 */
export class Admin extends Component {

  /**
   * Creates an instance of Admin.
   * 
   * @param {any} props
   * 
   * @memberOf Admin
   */
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: props.params.menu || 'hierarchy',
    };
  }

  /**
   * Fetch the application hierarchy from the API - add the inactive flag
   * to the url to also retrieve sites that have been set inactive.
   * 
   * @memberOf Admin
   */
  componentDidMount() {
    this.props.fetchHierarchy('?inactive=true');
  }

  /**
   * Only update if the hierarchy or url has updated 
   *
   * @param {any} nextProps
   * @param {any} nextState
   * @returns
   * 
   * @memberOf Admin
   */
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

  /**
   * Render the correct menu based on the URL structure
   * 
   * @returns JSX.Element
   * 
   * @memberOf Admin
   */
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

Admin.propTypes = {
  menu: PropTypes.object.isRequired,
  fetchHierarchy: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  hierarchy: PropTypes.object.isRequired,
  sites: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.get('auth').get('user'),
    hierarchy: state.get('hierarchy').get('sites'),
  };
}

export default connect(mapStateToProps, { fetchHierarchy })(Admin);
