import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader } from 'material-ui/Card';
import Lock from 'material-ui/svg-icons/action/lock';
import { is } from 'immutable';

import AdminTabs from './admin_tabs';
import AdminHierarchy from './admin_hierarchy';
import Modules from './admin_module';
import ApiCalls from './admin_api';
import { fetchHierarchy } from '../../actions/api';
import { buildNavigate } from '../../utils/resolver';
import { IReduxState, Iuser } from '../../constants/interfaces';

const navigate = buildNavigate('/admin');

interface Iparams { menu: string; splat: string; }

export interface IAdminProps {
  fetchHierarchy: Function;
  hierarchy: Object;
  params: Iparams;
  user: Iuser;
  sites: Array<Object>;
}

export interface IAdminState {
  activeMenu: string;
}

/**
 * General admin controller element
 *
 * @export
 * @class Admin
 * @extends {Component}
 */
export class Admin extends React.Component<IAdminProps, IAdminState> {

  /**
   * Creates an instance of Admin.
   *
   * @param {any} props
   *
   * @memberOf Admin
   */
  constructor(props: IAdminProps) {
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
  shouldComponentUpdate(nextProps: IAdminProps, nextState: IAdminState) {
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
      case 'apicalls':
        return <ApiCalls />;
      case 'modules':
        return <Modules key={Math.random()} />;
      default:
        return <AdminHierarchy splat={splat} sites={this.props.sites} />;
    }
  }

  render() {
    if (!this.props.user.admin) {
      return (
        <div className="admin__message">
          <Lock style={{ height: '200px', width: '200px', color: 'white' }} />
          <h3 style={{ color: 'white' }}>You are not authorized to view this section</h3>
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
          title="Admin"
          subtitle="Application administration menu"
        />
        <AdminTabs navigate={navigate} value={this.props.params.menu} />
        {this.renderMenu()}
      </Card>
    );
  }
}

function mapStateToProps(state: IReduxState) {
  const reduxState: IReduxState = state.toJS();
  console.log(reduxState);
  return {
    user: state.auth.user,
    hierarchy: state.hierarchy.sites,
  };
}

export default connect(mapStateToProps, { fetchHierarchy })(Admin);
