import React, { Component, PropTypes } from 'react';

import MachineList from '../__library__/machine_list';
import InstrumarDashboard from './instrumar_dashboard';

class Overview extends Component {

  constructor(props) {
    super(props);
    console.log(props.data, props.parent);
    this.state = {
      department: props.type === 'department',
    };
  }

  render() {
    return (
      <div className="ox_overview__container" >
        <InstrumarDashboard />
      </div>
    );
  }
}

Overview.propTypes = {
  data: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default Overview;
