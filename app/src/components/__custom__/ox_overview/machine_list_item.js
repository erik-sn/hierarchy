import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

function parseProduct(file) {
  const re = /[a-zA-Z]\d{4}|[$]\d{4}[A-Z]/g;
  return file.match(re)[0];
}

function parseDate(date) {
  return moment(date).format('MM/DD/YY HH:mm');
}

const MachineListItem = (props) => {
  const { specification } = props;
  const machine = specification.get('machine').substring(0, 4);
  return (
    <Link
      className="host__label-large ox_overview__machine-item"
      to={`${window.location.pathname}/${specification.get('machine').toLowerCase()}`}
    >
      <div className="ox_overview__machine-item-container">
        <div className="ox_overview__machine-item-left">{machine}</div>
        <div className="ox_overview__machine-item-right">
          <div className="ox_overview__machine-item-right-upper">
            <div className="ox_overview__machine-item-info-container">
              <div className="ox_overview__machine-item-yarnid">{parseProduct(specification.get('fileName'))}</div>
              <div className="ox_overview__machine-item-lot">{specification.get('lotNumber')}</div>
            </div>
          </div>
          <div className="ox_overview__machine-item-right-lower">
            {specification.get('fileName')}
          </div>
        </div>
        <div className="ox_overview__machine-item-date-container">
          <div className="ox_overview__machine-item-date">{parseDate(specification.get('createDate'))}</div>
        </div>
      </div>
    </Link>
  );
}

MachineListItem.propTypes = {
  specification: PropTypes.object.isRequired,
};

export default MachineListItem;
