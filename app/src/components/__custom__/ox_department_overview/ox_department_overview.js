import React, { Component, PropTypes } from 'react';

import MachineList from '../__library__/machine_list';

class Overview extends Component {

  render() {
    return (
      <div className="department__machine-container">
        <MachineList machines={this.props.parent.get('machines')} />
      </div>
    );
  }
}

Overview.propTypes = {
  parent: PropTypes.object.isRequired,
};

export default Overview;
