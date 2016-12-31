if (process.env.BROWSER) {
  require('./ox_overview.scss');  // eslint-disable-line global-require
}
import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';

import { alphaNumSort } from '../../../utils/sort';

import MachineList from './machine_list';
import InstrumarDashboard from './instrumar_dashboard';
import WasteChart from './waste_chart';
import SetpointChart from './setpoint_chart';
import UptimeChart from './uptime_chart';


const setpointFilter = (input, id) => input.filter(setpoint => setpoint.get('machine') === id);

class Overview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      department: props.type === 'department',
      pw_setpoints: undefined,
      pw_machines: undefined,
    };
  }

  getSpecificationData() {
    const { data } = this.props;
    if (!data || !data.get('ox_specifications')) {
      return List([]);
    }
    return data.get('ox_specifications').sort((a, b) => alphaNumSort(a.get('machine'), b.get('machine')));
  }

  getBreakData() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_breaks')) {
      return undefined;
    }
    const statusFilter = status => data.get('ox_breaks').filter(brk => brk.get('status') === status);
    let doff = statusFilter('Doff');
    let process = statusFilter('Process');
    let normal = statusFilter('Normal');

    if (!this.state.department) {
      const machineFilter = input => input.filter(brk => brk.get('machine') === parent.get('name').substring(0, 4));
      doff = machineFilter(doff);
      process = machineFilter(process);
      normal = machineFilter(normal);
    }
    return Map({ doff, process, normal });
  }

  getSetpointData() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_setpoints') || !data.get('pw_machines')) {
      return undefined;
    }
    const setpoints = data.get('ox_setpoints');
    if (this.state.department) {
      return setpoints;
    }
    const machineId = data.get('pw_machines').find(mch => mch.get('name') === parent.get('name').substring(0, 4)).get('id');
    return Map({
      onspec: setpointFilter(setpoints.get('onspec'), machineId),
      offspec: setpointFilter(setpoints.get('offspec'), machineId),
      invalid: setpointFilter(setpoints.get('invalid'), machineId),
    });
  }

  render() {
    const { parent } = this.props;
    return (
      <div className="ox_overview__container" >
        <div className="ox_overview__top-container">
          {this.state.department ?
            <MachineList specifications={this.getSpecificationData()} /> :
              <InstrumarDashboard machine={parent.get('name').substring(0, 4)} />
          }
        </div>
        <div className="ox_overview__bottom-container">
          <div className="ox_overview__bottom-left">
            <SetpointChart setpoints={this.getSetpointData()} />
            <UptimeChart data={this.getBreakData()} />
          </div>
          <div className="ox_overview__bottom-right">
            <WasteChart
              department={this.state.department}
              parent={parent}
            />
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  data: PropTypes.object,
  parent: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default Overview;
