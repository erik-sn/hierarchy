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
  return rowMap.map((option, i) =>  {
    const width = option.get('width');
    const header = option.get('header');
    const label = option.get('label');
    return (
      <div
        key={i}
        style={label === sortParameter ? { color: 'white', width } : { width }}
        onClick={() => handleClick(label)}
        className="filter_table__header-cell"
      >
        <span className="filter_table__header-cell-label">{header}</span>
        <span className="filter_table__header-cell-icon">
          {generateSortIcon(sortParameter, label, sortDirection)}
        </span>
      </div>
    );
  });
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
  sortDirection: PropTypes.number,
  sortParameter: PropTypes.string,
};


export default Header;
