import * as React from 'react';
import { browserHistory } from 'react-router';

export interface INavbarNavProps {
  to: string;
  name: string;
  handleClick: (e: React.MouseEvent<{}>) => void;
  active: boolean;
}

const Nav = ({ active, to, name, handleClick }: INavbarNavProps) => {
  const lastClass = active ? 'navbar__hierarchy-item-last' : '';
  const handleNavigate: any = () => browserHistory.push(to.toLowerCase());
  return (
    <div className="navbar__hierarchy-item-parent" onClick={handleClick}>
      <div className="navbar__chain-container" />
        <div
          onClick={active ? undefined : handleNavigate}
          className={`navbar__hierarchy-item-child ${lastClass}`}
        >
          {name}
        </div>
    </div>
  );
};

export default Nav;
