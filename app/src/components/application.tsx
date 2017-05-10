import { fromJS } from 'immutable';
import { Card } from 'material-ui/Card';
import * as React from 'react';
import { connect } from 'react-redux';

import { fetchAuth, fetchHierarchy } from '../actions/api';
import { showModal } from '../actions/index';
import { IAction, IAppConfig, ILocation, IModal, IReduxState, ISite, IUser } from '../constants/interfaces';
import { resolvePath } from '../utils/resolver';

import Loader from './loader';
import Modal from './modal';
import Navbar from './navbar/navbar';

export interface IApplicationProps {
  children: JSX.Element[];
  config: IAppConfig;
  fetchAuth: () => IAction;
  fetchHierarchy: () => IAction;
  location: ILocation; // create interface
  modal: IModal;
  userError: boolean;
  user: IUser;
  siteError: boolean;
  sites: ISite[];
}

export class Application extends React.Component<IApplicationProps, {}> {

  public componentDidMount() {
    const { user, userError, sites, siteError } = this.props;
    if (!userError && !siteError && user && !user.username) {
      this.props.fetchAuth();
    }
    if (!userError && !siteError && !sites) {
      this.props.fetchHierarchy();
    }
  }

  public render() {
    const { user, location, userError, sites, siteError, children, modal, config } = this.props;
    // check to see if there are any errors
    let error;
    if (userError || siteError) {
      error = (
        <Modal
          title="Error"
          error
          contentClass="modal__error"
          message={`There was an error retrieving application information - 
            please refresh the page or contact the administrator`}
        />
      );
    }
    // wait for hierarchy and authentication information to load

    let loader;
    if (!user || !user.username || !sites) {
      loader = <div style={{ marginTop: '20%' }}><Loader scale={2} /></div>;
    }

    let modalComponent;
    if (modal && modal.showModal && modal.component) {
      modalComponent = modal.component;
    }

    let hierarchy: any;
    let content;
    if (sites && location) {
      // check to see if hiearchy exists, if not do not resolve path
      try {
        hierarchy = resolvePath(sites, location.pathname);
      } catch (e) {
        hierarchy = undefined;
      }
      const cloneChild = (child: React.ReactElement<{}>) => React.cloneElement(child, { sites, hierarchy } as any);
      content = React.Children.map(children, cloneChild);
    }
    return (
      <div className="application__container">
        <Navbar sites={sites} user={user} hierarchy={hierarchy} path={location.pathname} config={config} />
        <div className="application__content-container">
          <Card
            className="application__content-card"
            style={{ padding: '25px', width: '100%' }}
            containerStyle={{ width: '100%' }}
          >
            {error || loader || modalComponent || content}
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IReduxState): {} {
  return {
    user: state.auth.user,
    userError: state.auth.error,
    sites: state.hierarchy.sites,
    siteError: state.hierarchy.error,
    modal: state.display.config,
    config: state.display.config,
  };
}

const ApplicationContainer = connect<{}, {}, IApplicationProps>(mapStateToProps, {
  showModal, fetchAuth, fetchHierarchy })(Application);

export default ApplicationContainer;
