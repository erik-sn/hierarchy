import * as React from 'react';
import { Link } from 'react-router';

import { IHierarchyTier, IModule } from '../../constants/interfaces';

const appConfig = require('../../../appconfig.json');

export interface IModuleProps {
  activeModule: IModule;
  module: IModule;
  hierarchyObject: IHierarchyTier;
  setActive: (module: IModule) => void;
}

function getUrl() {
  const url = window.location.pathname.replace(/\/+$/, '').replace(appConfig.baseUrl, '');
  return url.indexOf('/m/') > 0 ? url.substring(0, url.indexOf('/m/')) : url;
}

const Module = ({ activeModule, module, setActive, hierarchyObject }: IModuleProps) => {
  const url = getUrl();
  const isActive = activeModule && activeModule.name === module.name;
  const isDefault = hierarchyObject.defaultModule && module.id === hierarchyObject.defaultModule.id;
  const handleClick = () => setActive(module);
  return (
    <Link to={isDefault ? url : `${url}/m/${module.label}`.toLowerCase()} >
      <div
        className={`display__module-item ${isActive ? 'host__tab-selected' : 'host__tab'}`}
        onClick={handleClick}
      >
        {module.description ?
          <div className="display__module-item-tooltip tooltip">
            {module.description}
          </div>
        : undefined}
        {module.label}
      </div>
    </Link>
  );
};

export default Module;
