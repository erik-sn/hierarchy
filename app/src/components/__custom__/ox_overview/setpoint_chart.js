import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';

import PieChart from '../../charts/pie_chart';
import Loader from '../../loader';

class SetpointChart extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.setpoints && nextProps.setpoints) {
      return !is(this.props.setpoints, nextProps.setpoints)
    }
    return true;
  }

  render() {
    const { setpoints } = this.props;
    if (!setpoints) {
      return <Loader style={{ height: '225px' }} size={75} thickness={5} />;
    }

    const data = [
      { name: 'on spec', value: setpoints.get('onspec').size },
      { name: 'off spec', value: setpoints.get('offspec').size },
      { name: 'invalid', value: setpoints.get('invalid').size },
    ];

    return (
      <div className="ox_overview__setpoints">
        <PieChart data={data} />
      </div >
    );
  }
}

SetpointChart.propTypes = {
  setpoints: PropTypes.object,
};

export default SetpointChart;
