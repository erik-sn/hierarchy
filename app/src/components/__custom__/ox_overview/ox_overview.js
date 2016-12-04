if (process.env.BROWSER) {
  require('./ox_overview.scss');  // eslint-disable-line global-require
}
import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import moment from 'moment';

import { alphaNumSort } from '../../../utils/sort';

import MachineList from './machine_list';
import InstrumarDashboard from './instrumar_dashboard';
import WasteChart from './waste_chart';
import SetpointChart from './setpoint_chart';
import UptimeChart from './uptime_chart';


const setpointFilter = (input, id) => input.filter(setpoint => setpoint.get('machine') === id);


const uptimeData = List([{ name: 'group a', value: 400 }, { name: 'Group B', value: 300 },
              { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 }]);

class Overview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      department: props.type === 'department',
      pw_setpoints: undefined,
      pw_machines: undefined,
    };
  }

  getWorkOrderData() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_workorders')) {
      return undefined;
    }

    if (this.state.department) {
      return data.get('ox_waste').get('department');
    } else if (data && data.get('ox_waste')) {
      return data.get('ox_waste').get('machine').filter(machine => (
        machine.get('machine') === parent.get('name').substring(0, 4)
      ));
    }
    return undefined;
  }

  getSpecificationData() {
    const { data } = this.props;
    if (!data || !data.get('ox_specifications')) {
      return List([]);
    }
    return data.get('ox_specifications').sort((a, b) => alphaNumSort(a.get('machine'), b.get('machine')));
  }

  getWasteData() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_waste')) {
      return undefined;
    }

    if (this.state.department) {
      return data.get('ox_waste').get('department');
    }
    return data.get('ox_waste').get('machine').filter(machine => (
      machine.get('machine') === parent.get('name').substring(0, 4)
    ));
  }

  getBreakData() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_breaks')) {
      return undefined;
    }
    let breaks = data.get('ox_breaks').filter(brk => brk.get('status') !== 'Normal');
    let running = data.get('ox_breaks').filter(brk => brk.get('status') === 'Normal');
    if (!this.state.department) {
      breaks = breaks.filter(brk => brk.get('machine') === parent.get('name').substring(0, 4));
      running = running.filter(brk => brk.get('machine') === parent.get('name').substring(0, 4));
    }
    return List([breaks, running]).forEach(array => array.map((brk) => {
      const momentBreak = brk.set('starttime', moment(brk.get('starttime')));
      return momentBreak.set('endtime', moment(brk.get('endtime')));
    }));
  }

  getUptimeData() {
    const { data, parent } = this.props;
    if (!data || !data.get('ox_uptime')) {
      return undefined;
    }

    const machines = data.get('ox_uptime');
    if (this.state.department) {
      const average = machines.reduce((sum, curr) => sum + curr.get('uptimePercent'), 0) / machines.size;
      const children = machines.map(machine => (
        Map({ label: machine.get('name'), uptime: machine.get('uptimePercent') })
      ));
      return Map({ average, children });
    }
    // machine
    const machine = machines.find(mch => mch.get('name') === parent.get('name').substring(0, 4));
    const children = machine.get('positions').entrySeq().map(([key, value]) => (
      Map({ label: key, uptime: value.get('uptimePercent') })
    ));
    return Map({ average: machine.get('uptimePercent'), children });
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
            <UptimeChart data={uptimeData} />
          </div>
          <div className="ox_overview__bottom-right"><WasteChart data={this.getWasteData()} /></div>
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
