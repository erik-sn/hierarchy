import React from 'react';

import AdminSiteList from './admin_site_list';
import AdminSite from './admin_site';
import { buildNavigate } from '../../utils/resolver';

const navigate = buildNavigate('/admin/hierarchy');

const AdminHierarchy = ({ sites, splat }) => {
  const code = splat ? splat.split('/')[1] : undefined; // parse remainder url for parameters
  let activeSite;
  let siteNavigate;
  if (code) {
    activeSite = sites.find(site => code.toUpperCase() === site.get('code'));
    siteNavigate = buildNavigate(`/admin/hierarchy/${code}`);
  }
  const adminSiteList = <AdminSiteList navigate={navigate} sites={sites} />;
  const adminSite = <AdminSite navigate={siteNavigate} site={activeSite} splat={splat} />;
  return (
    <div className="admin__hierarchy-container">
      {activeSite ? adminSite : adminSiteList}
    </div>
  );
};

export default AdminHierarchy;
