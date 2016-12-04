import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';

import PieChart from '../../charts/pie_chart';
import Loader from '../../loader';

class UptimeChart extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.data && nextProps.data) {
      console.log(nextProps.data.toJS(), this.props.data.toJS());
      return !is(this.props.data, nextProps.data);
    }
    return true;
  }

  render() {
    const { data } = this.props;
    if (!data) {
      return <Loader style={{ height: '225px' }} size={75} thickness={5} />;
    }

    return (
      <div className="ox_overview__setpoints">
        <PieChart data={data.toJS()} />
      </div >
    );
  }
}

UptimeChart.propTypes = {
  data: PropTypes.array,
};

export default UptimeChart;
