import { is } from 'immutable';
import { Card, CardHeader } from 'material-ui/Card';
import Lock from 'material-ui/svg-icons/action/lock';
import * as React from 'react';
import { connect } from 'react-redux';

import { fetchHierarchy } from '../../actions/api';
import { IReduxState, ISite, Iuser } from '../../constants/interfaces';
import { buildNavigate } from '../../utils/resolver';
import ApiCalls from './admin_api';
import AdminHierarchy from './admin_hierarchy';
import Modules from './admin_module';
import AdminTabs from './admin_tabs';

const navigate = buildNavigate('/admin');

interface Iparams { menu: string; splat: string; }

export interface IAdminProps {
  fetchHierarchy: Function;
  params: Iparams;
  user: Iuser;
  sites: ISite[];
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
  public componentDidMount() {
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
  public shouldComponentUpdate(nextProps: IAdminProps, nextState: IAdminState) {
    if (this.props.params.menu !== nextProps.params.menu) {
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
  public renderMenu() {
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

  public render() {
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
  return {
    user: reduxState.auth.user,
    sites: reduxState.hierarchy.sites,
  };
}

export default connect<{}, {}, IAdminProps>(mapStateToProps, { fetchHierarchy })(Admin);
