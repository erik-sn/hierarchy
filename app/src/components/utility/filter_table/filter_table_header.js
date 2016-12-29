import React, { PropTypes } from 'react';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';

function generateSortIcon(parameter, label, direction) {
  if (parameter === label && direction === 1) {
    return <UpIcon />;
  } else if (parameter === label && direction === 0) {
    return <DownIcon />;
  }
}

function generateColumns(rowMap, handleClick, sortDirection, sortParameter) {
  return rowMap.map(({ width, header, label }, i) =>  (
    <div
      key={i}
      style={{ width }}
      onClick={() => handleClick(label)}
      className="filter_table__header-cell"
      style={ label === sortParameter ? { color:  'white', width } : { width } }
    >
      <span className="filter_table__header-cell-label">{header}</span>
      <span className="filter_table__header-cell-icon">
        {generateSortIcon(sortParameter, label, sortDirection)}
      </span>
    </div>
  ));
}

const Header = ({ className, rowMap, handleClick, sortDirection, sortParameter }) => (
  <div className={`filter_table__header${className ? ` ${className}` : ''}`}>
    {generateColumns(rowMap, handleClick, sortDirection, sortParameter)}
  </div>
);

Header.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
  rowMap: PropTypes.array.isRequired,
};


export default Header;
