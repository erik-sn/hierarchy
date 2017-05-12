import * as React from 'react';

import { IBaseModule, IDepartment } from '../../../constants/interfaces';
import MachineList from '../machine_list';


interface IProps extends IBaseModule {
  
}

const Overview = (props: IProps) => {
  return (
    <div className="line_overview__container">
      {props.type === 'department'
        ? <MachineList machines={(props.parent as IDepartment).machines} />
        : undefined}
    </div>
  );
}

export default Overview;