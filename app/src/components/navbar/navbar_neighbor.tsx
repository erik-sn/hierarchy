import * as React from 'react';
import { Link } from 'react-router';

export interface INeighborProps {
  path: string;
  name: string;
  hide: (e: React.MouseEvent<{}>) => void;
}


function cleanModuleFromUrl(url: string): string {
  const moduleIndex = url.indexOf('/m/');
  return moduleIndex > 0 ? url.substring(0, moduleIndex) : url;
}

const Neighbor = ({ path, hide, name }: INeighborProps): JSX.Element => {
  const rootIndex = path ? cleanModuleFromUrl(path).lastIndexOf('/') + 1 : 0;
  const newPath = path ? path.substring(0, rootIndex) + name.toLowerCase() : '';
  return (
    <Link to={newPath} onClick={hide} >
      <div className="host__label-small navbar__neighbor-item">{name}</div>
    </Link>
  );
};

export default Neighbor;
