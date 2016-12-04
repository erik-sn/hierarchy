import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';

import AreaChart from '../../charts/area_chart';
import Loader from '../../loader';


class WasteChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: '11/30/16',
      endDate: '12/02/16',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(nextProps.data, this.props.data);
  }

  render() {
    if (this.props.data === null) {
      return <h3>Error</h3>;
    }
    if (!this.props.data) {
      return <Loader style={{ height: '400px' }} size={75} thickness={5} />;
    }

    // ignore entries with no production, this is a clerical error in AS400
    const data = this.props.data.filter(shift => shift.get('productionPounds') > 0)
    .map(shift => ({
      date: `${shift.get('date').substring(5, 7)}/${shift.get('date').substring(8, 10)}-${shift.get('shift')}`, 
      value: shift.get('wastePercent'),
    }));

    return (
      <AreaChart
        xAxis="date"
        data={data.toJS()}
        lines={[{ strokeWidth: 4, type: 'linear', dot: false, dataKey: 'value', fill: '#59A1B6', stroke: '#285F64', isAnimationActive: false }]}
        download
        image
      />
    );
  }
}

WasteChart.propTypes = {
  data: PropTypes.object,
};

export default WasteChart;
