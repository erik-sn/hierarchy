if (process.env.BROWSER) {
  require('./ox_overview.scss');  // eslint-disable-line global-require
}

import React, { PropTypes } from 'react';

const InstrumarDashboard = ({ machine }) => (
  <div className="ox_overview__instrumar">
    <iframe
      scrolling="no"
      src={`http://10.100.100.17/Instrumar.ProductionDashboard/(S(a3thajsyvz1rgcwssu2dyzha))/Dashboard/Index/OX${machine}`}
    />
  </div>
);

InstrumarDashboard.propTypes = {
  machine: PropTypes.string.isRequired,
};

export default InstrumarDashboard;
