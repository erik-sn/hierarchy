import React, { Component } from 'react';

import SiteList from './admin_site_list';
import SiteAdmin from './admin_site';

class AdminHierarchy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeSite: undefined,
    };
    this.selectSite = this.selectSite.bind(this);
  }

  selectSite(siteName) {
    const activeSite = this.props.sites.find(site => siteName === site.get('code'));
    this.setState({ activeSite });
  }

  render() {
    const { sites, splat } = this.props;
    const code = splat ? splat.split('/')[1] : undefined; // parse remainder url for parameters
    let activeSite;
    if (code) {
      activeSite = sites.find(site => code.toUpperCase() === site.get('code'));
    }
    return (
      <div className="admin__hierarchy-container">
        {activeSite ? <SiteAdmin site={activeSite} splat={splat} /> : <SiteList sites={sites} />}
      </div>
    );
  }
}

export default AdminHierarchy;
