if (process.env.BROWSER) {
  require('./ox_overview.scss');  // eslint-disable-line global-require
}
import React, { Component, PropTypes } from 'react';

import MachineList from '../__library__/machine_list';
import InstrumarDashboard from './instrumar_dashboard';
import WasteChart from './waste_chart';

class Overview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      department: props.type === 'department'
    };
  }

  render() {
    const { data } = this.props;
    if (this.state.department) {
      
    }
    return (
      <div className="ox_overview__container" >
        {this.state.department ?
        <MachineList machines={this.props.parent.get('machines')} /> :
        <InstrumarDashboard machine="ox11" />
        }
        <WasteChart data={data ? data.get('ox_waste') : undefined} />
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