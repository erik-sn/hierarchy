import React, { PropTypes } from 'react';

function generateColumns(rowMap) {
  return rowMap.map(({ width, header }, i) => (
    <div key={i} style={{ width }}><h5>{header}</h5></div>
  ));
}

const Header = ({ className, rowMap }) => (
  <div className={`filter_table__header${className ? ` ${className}` : ''}`}>
    {generateColumns(rowMap)}
  </div>
);

Header.propTypes = {
  rowMap: PropTypes.array.isRequired,
  className: PropTypes.string,
};


export default Header;
