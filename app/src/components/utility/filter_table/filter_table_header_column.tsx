import DownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import * as React from 'react';

import { IConfig } from '../../../constants/interfaces';

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
function generateSortIcon(parameter: string, label: string, direction: number): JSX.Element {
  if (parameter === label && direction === 1) {
    return <UpIcon />;
  } else if (parameter === label && direction === -1) {
    return <DownIcon />;
  }
}

export interface IHeaderColumnProps {
  option: IConfig;
  sortParameter: string;
  sortDirection: number;
  handleClick: (label: string) => void;
}

const HeaderColumn = ({ option, sortParameter, sortDirection, handleClick }: IHeaderColumnProps) => {
  const { width, header, label, childrenClass } = option;
  const handleHeaderClick = () => handleClick(label);
  return (
    <div
      style={label === sortParameter ? { color: 'white', width } : { width }}
      onClick={handleHeaderClick}
      className={`filter_table__header-cell ${childrenClass || ''}`.trim()}
    >
      <span className="filter_table__header-cell-label">{header}</span>
      <span className="filter_table__header-cell-icon">
        {generateSortIcon(sortParameter, label, sortDirection)}
      </span>
    </div>
  );
};

export default HeaderColumn;
