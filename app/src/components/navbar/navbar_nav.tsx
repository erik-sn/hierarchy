import * as React from 'react';
import { Link } from 'react-router';

export interface INavbarNavProps {
  to: string;
  name: string;
  handleClick: (e: React.MouseEvent<{}>) => void;
  active: boolean;
}

const Nav = ({ active, to, name, handleClick }: INavbarNavProps) => {
  const isLast = active ? 'navbar__hierarchy-item-last' : '';
  return (
    <div className={`navbar__hierarchy-item-parent ${isLast}`} onClick={handleClick}>
      <div className="navbar__chain-container" />
      <Link to={to.toLowerCase()} >
        <div className="navbar__hierarchy-item-child">{name}</div>
      </Link>
    </div>
  );
};

export default Nav;
