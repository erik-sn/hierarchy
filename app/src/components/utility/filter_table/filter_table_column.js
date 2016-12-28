import React from 'react';

const Column = props => (
  <div
    style={{width: props.width}}
    className={`filter_table__column${props.className? ` ${props.className}` : ''}`}
  >
    {props.value}
  </div>
);

Column.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};


export default Column;