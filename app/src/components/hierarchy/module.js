import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AppConfig from '../../../appconfig.json';


function getUrl() {
  const url = window.location.pathname.replace(/\/+$/, '').replace(AppConfig.baseUrl, '');
  return url.indexOf('/m/') > 0 ? url.substring(0, url.indexOf('/m/')) : url;
}

const Module = ({ activeModule, module, setActive, hierarchyObject }) => {
  const url = getUrl();
  const isActive = activeModule && activeModule.get('name') === module.get('name');
  const isDefault = module.get('id') === hierarchyObject.get('defaultModule').get('id');
  return (
    <Link to={isDefault ? url : `${url}/m/${module.get('label')}`.toLowerCase()} >
      <div
        className={`display__module-item ${isActive ? 'host__tab-selected' : 'host__tab'}`}
        onClick={() => setActive(module)}
      >
        {module.get('label')}
      </div>
    </Link>
  );
};

Module.propTypes = {
  activeModule: PropTypes.object.isRequired,
  module: PropTypes.object.isRequired,
  hierarchyObject: PropTypes.object.isRequired,
  setActive: PropTypes.func.isRequired,
};

export default Module;
