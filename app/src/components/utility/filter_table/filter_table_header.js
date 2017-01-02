import React, { PropTypes } from 'react';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';

/**
 * Return an icon depending on whether or not the sort
 * parameter matches the column header label, and which
 * direction we are sorting in
 *
 * @param {string} parameter - sort parameter
 * @param {string} label - column header label
 * @param {number} direction - 1 = ascending, 0 = descending
 * @returns {JSX.Element} - Icon
 */
function generateSortIcon(parameter, label, direction) {
  if (parameter === label && direction === 1) {
    return <UpIcon />;
  } else if (parameter === label && direction === 0) {
    return <DownIcon />;
  }
}

/**
 * Generate a list of column headers. Header cells have special actions
 * associated with them, including an icon that designates whether or not
 * the table is being sorted and in which direction.
 *
 * @param {object} rowMap - immutable list
 * @param {function} handleClick - called on icon click
 * @param {number} sortDirection - 1 = ascending, 0 = descending
 * @param {string} sortParameter - column we are sorting by
 * @returns
 */
function generateColumns(rowMap, handleClick, sortDirection, sortParameter, className) {
  return rowMap.map((option, i) => {
    const width = option.get('width');
    const header = option.get('header');
    const label = option.get('label');
    return (
      <div
        key={i}
        style={label === sortParameter ? { color: 'white', width } : { width }}
        onClick={() => handleClick(label)}
        className={`filter_table__header-cell ${option.get('childrenClass') || ''}`.trim()}
      >
        <span className="filter_table__header-cell-label">{header}</span>
        <span className="filter_table__header-cell-icon">
          {generateSortIcon(sortParameter, label, sortDirection)}
        </span>
      </div>
    );
  });
}

/**
 * Container component to hold table header cells
 *
 * @param {any} { className, rowMap, handleClick, sortDirection, sortParameter }
 */
const Header = ({ className, rowMap, handleClick, sortDirection, sortParameter }) => (
  <div className="filter_table__header" >
    {generateColumns(rowMap, handleClick, sortDirection, sortParameter, className)}
  </div>
);

Header.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
  rowMap: PropTypes.object.isRequired,
  sortDirection: PropTypes.number,
  sortParameter: PropTypes.string,
};


export default Header;
