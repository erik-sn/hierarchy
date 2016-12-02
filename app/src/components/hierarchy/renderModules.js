import React from 'react';
import { Link } from 'react-router';

function generateSortModules(item) {
  const defaultId = item.get('defaultModule').get('id');
  return (a, b) => {
    if (a.get('id') === defaultId) {
      return -1;
    } else if (b.get('id') === defaultId) {
      return 1;
    }
    return 0;
  };
}

function getUrl() {
  const url = window.location.pathname.replace(/\/+$/, '');
  return url.indexOf('/m/') > 0 ? url.substring(0, url.indexOf('/m/')) : url;
}

export function retrieveModule(item, moduleName) {
  return item.get('modules').find(mdl => mdl.get('label').toLowerCase() === moduleName.toLowerCase());
}

export default function renderModules(activeModule, item, setActive) {
  const sortModules = generateSortModules(item);

  const url = getUrl();
  return item.get('modules')
  .sort(sortModules)
  .map((module, i) => {
    const isActive = activeModule && activeModule.get('name') === module.get('name');
    const isDefault = module.get('id') === item.get('defaultModule').get('id');
    return (
      <Link to={isDefault ? url : `${url}/m/${module.get('label')}`.toLowerCase()} >
        <div
          className={`display__module-item ${isActive ? 'host__tab-selected' : 'host__tab'}`}
          onClick={() => setActive(module)}
          key={i}
        >
          {module.get('label')}
        </div>
      </Link>
    );
  });
}