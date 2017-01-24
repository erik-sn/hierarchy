import * as React from 'react';
import { connect } from 'react-redux';

import AdminSiteList from './admin_site_list';
import AdminSite from './admin_site';
import { buildNavigate } from '../../utils/resolver';
import { fetchHierarchy } from '../../actions/api';

const navigate = buildNavigate('/admin/hierarchy');

export interface IAdminHierarchyProps {
  sites: Array<Object>;
  splat: string;
  fetchHierarchy?: Function;
}

export const AdminHierarchy = (props: IAdminHierarchyProps): JSX.Element => {
  const { sites, splat } = props;
  const code: string = splat ? splat.split('/')[1] : undefined; // parse remainder url for parameters
  let activeSite;
  let siteNavigate;
  if (code) {
    activeSite = sites.find(site => code.toUpperCase() === site.get('code'));
    siteNavigate = buildNavigate(`/admin/hierarchy/${code}`);
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

export default connect<{}, {}, IAdminHierarchyProps>(null, { fetchHierarchy })(AdminHierarchy);
