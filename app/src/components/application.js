import { fromJS } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card } from 'material-ui/Card';

import { showModal } from '../actions/index';
import { fetchAuth, fetchHierarchy } from '../actions/api';
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
    if (!userError && !siteError && !sites) {
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
    if (!user || !user.get('username') || !sites) {
      loader = <div style={{ marginTop: '20%' }}><Loader /></div>;
    }

    let modalComponent;
    if (modal && modal.get('showModal') && modal.get('component')) {
      modalComponent = modal.get('component').toJS();
    }

    let hierarchy;
    let content;
    if (sites && location) {
      // check to see if hiearchy exists, if not do not resolve path
      try {
        hierarchy = resolvePath(sites);
      } catch (e) {
        hierarchy = undefined;
      }
      content = React.Children.map(children, child => (
        React.cloneElement(child, { sites, hierarchy }))
      );
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

Application.propTypes = {
  children: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  fetchAuth: PropTypes.func.isRequired,
  fetchHierarchy: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  userError: PropTypes.bool,
  user: PropTypes.object.isRequired,
  siteError: PropTypes.bool,
  sites: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: fromJS(state.auth.user),
    userError: fromJS(state.auth.error),
    sites: fromJS(state.hierarchy.sites),
    siteError: fromJS(state.hierarchy.error),
    modal: fromJS(state.display.config),
    config: fromJS(state.display.config),
  };
}

const ApplicationContainer = connect(mapStateToProps, {
  showModal, fetchAuth, fetchHierarchy })(Application);

export default ApplicationContainer;
