import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import AdminSiteList from './admin_site_list';
import AdminSite from './admin_site';
import { buildNavigate } from '../../utils/resolver';
import { fetchHierarchy } from '../../actions/api';

const navigate = buildNavigate('/admin/hierarchy');

export const AdminHierarchy = ({ sites, splat, ...props }) => {
  const code = splat ? splat.split('/')[1] : undefined; // parse remainder url for parameters
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

AdminHierarchy.propTypes = {
  fetchHierarchy: PropTypes.func.isRequired,
  splat: PropTypes.string,
  sites: PropTypes.object.isRequired,
  modules: PropTypes.object,
};

export default connect(null, { fetchHierarchy })(AdminHierarchy);
