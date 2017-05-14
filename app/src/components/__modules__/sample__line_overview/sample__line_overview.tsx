import * as React from 'react';

import { IBaseModule, IDepartment } from '../../../constants/interfaces';
import Loader from '../../loader';
import MachineList from './machine_list';
import Safety from './safety';
import Variances from './variances';
import Waste from './waste';

const Overview = ({ type, parent, departmentDataStore }: IBaseModule) => {
  if (!departmentDataStore) {
    return <Loader />;
  }
  const machines = (parent as IDepartment).machines;

  // all department data
  const safety = departmentDataStore.get('procOverview').get('safety');
  const variances = departmentDataStore.get('procOverview').get('variances');
  const efficiency = departmentDataStore.get('procEfficiency');
  const production = departmentDataStore.get('procProduction');
  const scrap = departmentDataStore.get('procScrap');
  const forgeUptime = departmentDataStore.get('procForgeUptime');
  const forgeUnits = departmentDataStore.get('procForgeUnit');

  return (
    <div className="line_overview__container">
      <MachineList machines={(parent as IDepartment).machines} />
      <div className="overview__top overview__pair">
        <Safety plotData={safety} />
        <Variances plotData={variances} />
      </div>
      <div className="overview__middle">
        <Waste production={production} scrap={scrap} machines={machines} />
      </div>
    </div>
  );
};

export default Overview;
