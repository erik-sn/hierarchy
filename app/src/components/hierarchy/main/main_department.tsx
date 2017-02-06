import { Card, CardHeader, CardText } from 'material-ui/Card';
import * as React from 'react';
import { Link } from 'react-router';

import { IDepartment, ISite } from '../../../constants/interfaces';
import MachineContainer from './machine_container';
import DepartmentTitle from './main_department_title';

export interface IMainDepartmentProps {
  site: ISite;
  department: IDepartment;
}

export const MainDepartment = ({ site, department }: IMainDepartmentProps) => {
  const url = `/${site.code}/${department.name}`;
  return (
    <Card className="main__department-container">
      <CardHeader
        title={<DepartmentTitle url={url} name={department.name} />}
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
