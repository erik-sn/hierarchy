import * as React from 'react';
import { connect } from 'react-redux';

import { IDepartment, IMachine, ISite } from '../../../constants/interfaces';
import NotFound from '../../notfound';
import Department from './main_department';
import Site from './main_site';

interface IHierarchy {
  department: IDepartment;
  machine: IMachine;
  site: ISite;
}

export interface IMainProps {
  hierarchy: IHierarchy;
  sites: ISite[];
}

const Main = ({ hierarchy, sites }: IMainProps) => {
  if (!hierarchy) {
    return <NotFound />;
  }

  if (sites.length === 0) {
    return (
      <div className="main__message">
        <h3>No Sites Have been configured - contact the administrator</h3>
      </div>
    );
  }

  const site = hierarchy.site;
  let display;
  if (!site) {
    display = (
      <div className="main__sites">
        {sites.map((s, i) => <Site key={i} site={s} />)}
      </div>
    );
  } else {
    display = (
      <div className="main__departments">
        {site.departments.map((dpt, i) => <Department key={i} site={site} department={dpt} />)}
      </div>
    );
  }
  return (
    <div className="main__container">
      {display}
    </div>
  );
};

export default Main;
