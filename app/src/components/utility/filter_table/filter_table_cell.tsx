import * as React from 'react';

export interface ICellProps {
  width: string;
  value: string;
  className?: string;
  handleClick: () => void;
}

/**
 * Basic cell component for filter table
 *
 * @param {string, string, string} { width, className, value }
 */
const Cell = ({ width, value, className, handleClick }: ICellProps) => (
  <div
    onClick={handleClick}
    style={{ width }}
    className={`filter_table__cell${className ? ` ${className}` : ''}`}
  >
    {value}
  </div>
);

export default Cell;
