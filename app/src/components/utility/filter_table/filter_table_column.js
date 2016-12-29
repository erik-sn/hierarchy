import React, { PropTypes } from 'react';

const Column = ({ width, className, value }) => (
  <div
    style={{ width }}
    className={`filter_table__column${className ? ` ${className}` : ''}`}
  >
    {value}
  </div>
);

Column.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};


export default Column;