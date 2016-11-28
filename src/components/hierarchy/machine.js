import React, { PropTypes } from 'react';

const Machine = props => (
  <div className="machine__container">
    {props.machine.get('name')}
  </div>
);

Machine.propTypes = {
  machine: PropTypes.object.isRequired,
  // data: PropTypes.object.isRequired,
};

export default Machine;
