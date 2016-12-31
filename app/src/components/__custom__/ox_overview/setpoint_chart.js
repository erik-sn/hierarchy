import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';

import PieChart from '../../charts/pie_chart';
import Loader from '../../loader';

class SetpointChart extends Component {

  constructor(props) {
    super(props);
    this.colors = ['#59A1B6', 'red', '#555'];
  }

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
      { name: 'off spec', value: setpoints.get('offspec').size, color: '#ff0000' },
      { name: 'invalid', value: setpoints.get('invalid').size, color: '#555' },
    ];

    return (
      <div className="ox_overview__setpoints">
        <PieChart data={data} colors={this.colors} />
      </div >
    );
  }
}

SetpointChart.propTypes = {
  setpoints: PropTypes.object,
};

export default SetpointChart;
