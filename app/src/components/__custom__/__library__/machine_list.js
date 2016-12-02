import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const MachineList = props => (
  <div className="display__machine-container">
    {
    props.machines.map((mch, i) => (
      <Link className="host__label-small" key={i} to={`${window.location.pathname}/${mch.get('name').toLowerCase()}`}>
        <div className="display__machine-item">{mch.get('name')}</div>
      </Link>
    ))
    }
  </div>
);

MachineList.propTypes = {
  machines: PropTypes.object.isRequired,
};

export default MachineList;
