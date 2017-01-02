import React, { PropTypes } from 'react';
import moment from 'moment';

import Modal from '../../modal';
import AreaChart from '../../charts/area_chart';


function processPiData(piData) {
  return piData.map((point) => {
    const date = moment(point.get('timestamp')).format('MM/DD/YY HH:mm');
    return point.set('date', date).set('value', Number(point.get('value')));
  });
}

function getDomain(processedData) {
  const values = processedData.map(data => data.value);
  const min = Math.min.apply(null, values);
  const minDomain = Math.floor((min * 0.9) - 5 >= 0 ? min * 0.9 : 0);
  const max = Math.max.apply(null, values);
  const maxDomain = Math.ceil(max * 1.10);
  return [minDomain, maxDomain];
}

const PiModal = ({ tag, piData, handleClose }) => {
  if (!piData) {
    return <div />;
  }
  const processedData = processPiData(piData).toJS();

  return (
    <Modal onSubmit={handleClose} title={tag} >
      {processedData.length === 0 ? <h3>No Data Available</h3> : undefined}
      {[<div className="spa__pi-chart-container" key={1} >
        <AreaChart
          xAxis="date"
          domain={getDomain(processedData)}
          data={processedData}
          lines={[{ strokeWidth: 2, type: 'linear', dot: false, dataKey: 'value', fill: '#0c1115', stroke: '#0c1115', isAnimationActive: false }]}
          fill="#0c1115"
          download
          image
        />
      </div>]}
    </Modal>
  );
};

PiModal.propTypes = {
  piData: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  tag: PropTypes.string.isRequired,
};

export default PiModal;
