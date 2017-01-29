import * as React from 'react';
import { Link } from 'react-router';


export interface IMachineItemProps {
  name: string;
  url: string;
}

const MachineItem = ({ name, url }: IMachineItemProps) => (
  <Link className="main__machine-item host__label-small" to={`${url}/${name}`.toLowerCase()} >
    <div className="main__machine-item-label">{name}</div>
  </Link>
);

export default MachineItem;
