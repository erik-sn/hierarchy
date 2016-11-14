import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'material-ui/Card';

import { showModal, fetchAuth, fetchHierarchy } from '../actions/index';
import { resolvePath } from '../utils/resolver';

import Navbar from './navbar';
import Modal from './modal';
import Loader from './loader';

export class Application extends Component {

  componentDidMount() {
    const { user, userError, sites, siteError } = this.props;
    if (!userError && !siteError && user && !user.get('username')) {
      this.props.fetchAuth();
    }
    if (!userError && !siteError && sites && sites.size === 0) {
      this.props.fetchHierarchy();
    }
  }

  render() {
    const { user, location, userError, sites, siteError, children, modal, config } = this.props;
    // check to see if there are any errors
    let error;
    if (userError || siteError) {
      error = (
        <Modal
          title="Error"
          error
          message={`There was an error retrieving application information - 
            please refresh the page or contact the administrator`}
        />
      );
    }
    // wait for hierarchy and authentication information to load
    let loader;
    if (!user || !user.get('username') || !sites || sites.size === 0) {
      loader = <Loader />;
    }

    let modalComponent;
    if (modal && modal.get('showModal') && modal.get('component')) {
      modalComponent = modal.get('component').toJS();
    }

    let hierarchy;
    let content;
    if (sites.size > 0 && location) {
      // check to see if hiearchy exists, if not do not resolve path
      try {
        hierarchy = resolvePath(sites, location.pathname);
      } catch (e) {
        hierarchy = undefined;
      }
      content = React.Children.map(children, child => (
        React.cloneElement(child, { sites, hierarchy }))
      );
    }
    return (
      <div className="application__container">
        <Navbar user={user} hierarchy={hierarchy} path={location.pathname} config={config} />
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

function mapStateToProps(state) {
  return {
    user: state.get('auth').get('user'),
    userError: state.get('auth').get('error'),
    sites: state.get('hierarchy').get('sites'),
    siteError: state.get('hierarchy').get('error'),
    modal: state.get('display').get('modal'),
    config: state.get('display').get('config'),
  };
}


const ApplicationContainer = connect(mapStateToProps, {
  showModal, fetchAuth, fetchHierarchy })(Application);

export default ApplicationContainer;
