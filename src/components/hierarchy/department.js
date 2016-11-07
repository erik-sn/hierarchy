import React from 'react';
import { Link } from 'react-router';

const Department = (props) => {
  const site = props.hierarchy.get('site');
  const department = props.hierarchy.get('department');
  const machines = department.get('machines').sort((a, b) => a > b);
  const url = `/${site.get('code').toLowerCase()}/${department.get('name').toLowerCase()}`;

  const renderedMachines = machines.map((mch, i) => (
    <Link key={i} to={`${url}/${mch.get('name').toLowerCase()}`}>
      <div >{mch.get('name')}</div>
    </Link>
  ));
  return (
    <div>
      <div>Department</div>
      <div>
        {renderedMachines}
      </div>
    </div>
  );
};


export default Department;
