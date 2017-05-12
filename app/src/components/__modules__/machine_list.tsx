import * as React from 'react';
import { Link } from 'react-router';

import { IMachine } from "../../constants/interfaces";

const appConfig = require('../../../appconfig.json');

interface IProps {
  machines: IMachine[];
}

const MachineList = ({ machines }: IProps) => {
  const baseUrl = window.location.pathname.replace(appConfig.baseUrl, '');
  return (
    <div className="line_overview__machines">
      {machines.map((m, i) => <Link key={i} to={`${baseUrl}/${m.name}/`}>{m.name}</Link>)}
    </div>
  )
}

export default MachineList;
