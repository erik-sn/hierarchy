
import Place from 'material-ui/svg-icons/maps/place';
import * as React from 'react';
import { Link } from 'react-router';

import { ISite } from '../../../constants/interfaces';

export interface IMainSiteProps {
  site: ISite;
}

export const MainSite = ({ site }: IMainSiteProps) => (
  <Link
    className="main__site-container host__label-large"
    to={`/${site.code.toLowerCase()}`}
  >
    <div className="main__site-title">{`${site.name} - ${site.code}`}</div>
    <div className="main__site-subtitle">{site.location}</div>
    <div className="main__site-departmentcount">
      Departments: {site.departments.length}
    </div>
  </Link>
);

export default MainSite;
