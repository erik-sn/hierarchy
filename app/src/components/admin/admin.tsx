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

const appconfig = require('../../../appconfig.json');
const navigate = buildNavigate(`${appconfig.baseUrl}/admin`);

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
 * High level admin controller element
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
        return <Modules />;
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
  return {
    user: state.auth.user,
    sites: state.hierarchy.sites,
  };
}

export default connect<{}, {}, IAdminProps>(mapStateToProps, { fetchHierarchy })(Admin);
