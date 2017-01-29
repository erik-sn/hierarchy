import { Card, CardHeader, CardText } from 'material-ui/Card';
import * as React from 'react';

import { IDepartment } from '../../../constants/interfaces';
import { alphaNumSort } from '../../../utils/sort';
import MachineItem from './machine_item';

export interface IMachineContainerProps {
  department: IDepartment;
  url: string;
}

const MachineContainer = ({ department, url }: IMachineContainerProps) => {
  const sortedMachines: string[] = department.machines.map((mch) => mch.name).sort(alphaNumSort);
  return (
    <CardText style={{ padding: '0px' }} >
      <div className="main__machine-container">
        {sortedMachines.map((mch, j) => <MachineItem key={j} name={mch} url={url} />)}
      </div>
    </CardText>
  );
};

export default MachineContainer;
