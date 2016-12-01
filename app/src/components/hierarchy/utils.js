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

export function renderModules(activeModule, item, itemType) {
  const sortModules = generateSortModules(item);
  return item.get('modules')
  .sort(sortModules)
  .map((module, i) => {
    const isActive = activeModule && activeModule.get('name') === module.get('name');
    const tabClass = isActive ? 'host__tab-selected' : 'host__tab';
    return (
      <div
        className={`${itemType}-item ${tabClass}`}
        onClick={() => this.setState({ activeModule: module })}
        key={i}
      >
        {module.get('label')}
      </div>
    );
  });
}