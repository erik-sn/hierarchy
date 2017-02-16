import * as React from 'react';

import { fetchHierarchy } from '../../actions/api';
import { buildNavigate } from '../../utils/resolver';
import AdminSite from './admin_site';
import AdminSiteList from './admin_site_list';

import { ISite } from '../../constants/interfaces';

const appConfig = require('../../../appconfig.json');
const navigate = buildNavigate(`${appConfig.baseUrl}/admin/hierarchy`);

export interface IAdminHierarchyProps {
  sites: ISite[];
  splat: string;
  fetchHierarchy: (params?: string) => void;
}

/**
 * High level hierarchy component - render either the Site List or Site
 * controller components
 */
export const AdminHierarchy = (props: IAdminHierarchyProps): JSX.Element => {
  const { sites, splat } = props;
  const code: string = splat ? splat.split('/')[1] : undefined; // parse remainder url for parameters
  let activeSite: ISite;
  let siteNavigate;
  if (code) {
    activeSite = sites.find((site) => code.toUpperCase() === site.code);
    siteNavigate = buildNavigate(`${appConfig.baseUrl}/admin/hierarchy/${code}`);
  }

  const adminSiteList = (
    <AdminSiteList
      fetchHierarchy={props.fetchHierarchy}
      navigate={navigate}
      sites={sites}
    />
  );
  const adminSite = (
    <AdminSite
      fetchHierarchy={props.fetchHierarchy}
      navigate={siteNavigate}
      site={activeSite}
      splat={splat}
    />
  );
  return (
    <div className="admin__hierarchy-container">
      {activeSite ? adminSite : adminSiteList}
    </div>
  );
};

export default AdminHierarchy;
