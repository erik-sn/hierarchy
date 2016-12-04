import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';

import PieChart from '../../charts/pie_chart';
import Loader from '../../loader';

class UptimeChart extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.data && nextProps.data) {
      return !is(this.props.data, nextProps.data);
    }
    return true;
  }

  breakReduce(type) {
    return this.props.data.get(type).reduce((total, brk) => total + brk.get('duration'), 0);
  }

  render() {
    const { data } = this.props;
    if (!data) {
      return <Loader style={{ height: '225px' }} size={75} thickness={5} />;
    }
    const uptime = this.breakReduce('normal');
    const doff = this.breakReduce('doff');
    const process = this.breakReduce('process');
    console.log(uptime, doff, process);
    const pieData = [
      { name: 'Uptime', value: Math.round(uptime / 3600) },
      { name: 'Process', value: Math.round(process / 3600) },
      { name: 'Doff', value: Math.round(doff / 3600) },
    ];
    return (
      <div className="ox_overview__setpoints">
        <PieChart data={pieData} />
      </div >
    );
  }
}

UptimeChart.propTypes = {
  data: PropTypes.object,
};

export default UptimeChart;
