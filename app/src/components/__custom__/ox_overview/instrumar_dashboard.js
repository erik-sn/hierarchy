import React, { Component, PropTypes } from 'react';

import Loader from '../../loader';

class InstrumarDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
    };
    this.hideLoader = this.hideLoader.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showLoader !== this.state.showLoader) {
      return true;
    }
    return !nextProps.machine === this.props.machine;
  }

  hideLoader() {
    this.setState({ showLoader: false });
  }

  render() {
    const { showLoader } = this.state;
    const machine = this.props.machine.toUpperCase().substring(0, 4);
    return (
      <div className="ox_overview__instrumar">
        <div className="ox_overview__instrumar-loader">
          {showLoader ? <Loader size={75} thickness={5} /> : undefined}
        </div>
        <iframe
          style={{ display: showLoader ? 'none' : 'block' }}
          onLoad={this.hideLoader}
          id="ox_overview__instrumar-iframe"
          scrolling="no"
          src={`http://10.100.100.17/Instrumar.ProductionDashboard/(S(a3thajsyvz1rgcwssu2dyzha))/Dashboard/Index/${machine}`}
        />
      </div>
    );
  }
}

InstrumarDashboard.propTypes = {
  machine: PropTypes.string.isRequired,
};

export default InstrumarDashboard;