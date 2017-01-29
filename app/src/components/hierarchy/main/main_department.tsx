import { Card, CardHeader, CardText } from 'material-ui/Card';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import * as React from 'react';
import { Link } from 'react-router';

import { IDepartment, ISite } from '../../../constants/interfaces';
import MachineContainer from './machine_container';

export interface IMainDepartmentProps {
  site: ISite;
  department: IDepartment;
}

export const MainDepartment = ({ site, department }: IMainDepartmentProps) => {
  const url = `/${site.code}/${department.name}`;
  const title = (
    <Link to={url.toLowerCase()} >
      <div className="main__department-title">
        <div className="main__department-title-icon">
          <Arrow style={{ height: '35px', width: '35px' }} />
        </div>
        <div className="main__department-title-label">
          {`${department.name}`}
        </div>
      </div>
    </Link>
  );
  return (
    <Card className="main__department-container">
      <CardHeader
        title={title}
        actAsExpander
        showExpandableButton
      />
      <CardText
        style={{ padding: '0px' }}
        expandable
      >
        <MachineContainer url={url} department={department} />
      </CardText>
    </Card>
  );
};

export default MainDepartment;
