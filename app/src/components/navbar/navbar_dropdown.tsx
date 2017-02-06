import * as React from 'react';

import { IDictionary } from '../../constants/interfaces';

export interface INavDropdownProps {
  style: IDictionary<string>;
  neighbors: JSX.Element[];
}

const Dropdown = ({ style, neighbors }: INavDropdownProps) => (
  <div
    className="navbar__neighbor-container"
    style={style}
  >
    <div className="navbar__neighbor-list">
      {neighbors}
    </div>
  </div>
);

export default Dropdown;
