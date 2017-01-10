import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Machine from './machine';
import getComponent from '../../utils/library';

import { fetchDepartmentData } from '../../actions/index';
import renderModules, { retrieveModule } from './renderModules';

class Department extends Component {

  constructor(props) {
    super(props);
    const department = props.hierarchy.get('department');
    this.state = {
      activeModule: props.params.module ? retrieveModule(department, props.params.module) : department.get('defaultModule'),
      url: `${window.location.pathname}/${department.get('name').toLowerCase()}`,
    };
    this.setActiveModule = this.setActiveModule.bind(this);
  }

  componentDidMount() {
    const { hierarchy } = this.props;
    hierarchy.get('department').get('apiCalls').forEach((apiCall) => {
      this.props.fetchDepartmentData(hierarchy.get('department').get('id'), apiCall.get('url'), apiCall.get('key'));
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextDepartment = nextProps.hierarchy.get('department');
    const url = window.location.pathname;
    let activeModule = nextDepartment.get('defaultModule');
    if (nextDepartment.get('id') !== this.props.hierarchy.get('department').get('id')) {
      if (nextProps.params.module) {
        activeModule = retrieveModule(nextDepartment, nextProps.params.module);
      }
    }
    this.setState({ url, activeModule });
  }

  setActiveModule(activeModule) {
    this.setState({ activeModule });
  }

  renderActiveModule() {
    const { data, hierarchy } = this.props;
    const { activeModule } = this.state;
    const componentProps = {
      key: hierarchy.get('department').get('id'),
      type: 'department',
      parent: hierarchy.get('department'),
      module: activeModule,
      data,
    };
    return getComponent(activeModule.get('name'), componentProps);
  }

  render() {
    const { activeModule } = this.state;
    const { params, data, hierarchy } = this.props;
    if (params.machine) {
      return <Machine hierarchy={hierarchy} data={data} activeModuleLabel={params.module} />;
    }
    const description = activeModule ? activeModule.get('description') : '';
    return (
      <div className="display__container">
        <div className="display__module-container">
          {renderModules(activeModule, hierarchy.get('department'), this.setActiveModule)}
        </div>
        <div className="display__content-container" >
          {description.trim() !== '' ?
            <div className="display__description-container">
              {description}
            </div> : undefined}
          <div className="display__component-container">
            {!activeModule ? <h3 style={{ textAlign: 'center' }}>No Modules Available</h3> : this.renderActiveModule()}
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
