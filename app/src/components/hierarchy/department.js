import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Machine from './machine';
import getComponent from '../../utils/library';

import { fetchDepartmentData } from '../../actions/index';


class Department extends Component {

  constructor(props) {
    super(props);
    const site = props.hierarchy.get('site');
    const department = props.hierarchy.get('department');
    this.state = {
      activeModule: department.get('defaultModule'),
      url: `/${site.get('code').toLowerCase()}/${department.get('name').toLowerCase()}`,
    };
    this.sortModules = this.sortModules.bind(this);
  }

  componentDidMount() {
    const { hierarchy } = this.props;
    hierarchy.get('department').get('apiCalls').forEach((apiCall) => {
      this.props.fetchDepartmentData(hierarchy.get('department').get('id'), apiCall.get('url'), apiCall.get('key'));
    });
  }

  componentWillReceiveProps(nextProps) {
    const site = nextProps.hierarchy.get('site');
    const nextDepartment = nextProps.hierarchy.get('department');
    const url = `/${site.get('code').toLowerCase()}/${nextDepartment.get('name').toLowerCase()}`;
    if (nextDepartment.get('id') !== this.props.hierarchy.get('department').get('id')) {
      this.setState({ url, activeModule: nextProps.hierarchy.get('department').get('defaultModule') });
    } else {
      this.setState({ url });
    }
  }

  sortModules(a, b) {
    const defaultId = this.props.hierarchy.get('department').get('defaultModule').get('id');
    if (a.get('id') === defaultId) {
      return -1;
    } else if (b.get('id') === defaultId) {
      return 1;
    }
    return 0;
  }

  renderActiveModule() {
    const { data, hierarchy } = this.props;
    const { activeModule } = this.state;
    const dataStore = data ? data.get(activeModule.get('name').toLowerCase()) : {};
    const componentProps = { parent: hierarchy.get('department'), module: activeModule, data: dataStore };
    return getComponent(activeModule.get('name'), componentProps);
  }

  renderModules() {
    const department = this.props.hierarchy.get('department');
    return department.get('modules')
    .sort(this.sortModules)
    .map((module, i) => {
      const { activeModule } = this.state;
      const isActive = activeModule && activeModule.get('name') === module.get('name');
      const tabClass = isActive ? 'host__tab-selected' : 'host__tab';
      return (
        <div
          className={`department__module-item ${tabClass}`}
          onClick={() => this.setState({ activeModule: module })}
          key={i}
        >
          {module.get('label')}
        </div>
      );
    });
  }

  render() {
    const { activeModule } = this.state;
    const { params, data, hierarchy } = this.props;
    if (params.machine) {
      const machine = hierarchy.get('department').get('machines').find(mch => (
        mch.get('name').toLowerCase() === params.machine.toLowerCase()
      ));
      return (
        <Machine machine={machine} data={data} />
      );
    }
    const description = activeModule ? activeModule.get('description') : 'Machine List';
    return (
      <div className="department__container">
        <div className="department__module-container">
          {this.renderModules()}
        </div>
        <div className="department__content-container" >
          {description.trim() !== '' ?
            <div className="department__description-container">
              {description}
            </div> : undefined}
          <div className="department__component-container">
            {activeModule === null ? <h3 style={{ textAlign: 'center' }}>No Modules Available</h3> : this.renderActiveModule()}
          </div>
        </div>
      </div>
    );
  }
}

Department.propTypes = {
  data: PropTypes.object,
  hierarchy: PropTypes.object,
  fetchDepartmentData: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.hierarchy.get('department').get('id');
  return { data: state.get('data').get(id) };
}

export default connect(mapStateToProps, { fetchDepartmentData })(Department);
