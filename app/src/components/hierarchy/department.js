import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Machine from './machine';
import getComponent from '../../utils/library';

import { fetchDepartmentData } from '../../actions/index';


class Department extends Component {

  constructor(props) {
    super(props);
    const site = props.hierarchy.get('site');
    const department = props.hierarchy.get('department');
    this.state = {
      activeModule: undefined,
      url: `/${site.get('code').toLowerCase()}/${department.get('name').toLowerCase()}`,
    };
  }

  componentDidMount() {
    const { hierarchy } = this.props;
    hierarchy.get('department').get('apiCalls').forEach((apiCall) => {
      this.props.fetchDepartmentData(hierarchy.get('department').get('id'), apiCall.get('url'), apiCall.get('key'));
    });
  }

  componentWillReceiveProps(nextProps) {
    const site = nextProps.hierarchy.get('site');
    const department = nextProps.hierarchy.get('department');
    const url = `/${site.get('code').toLowerCase()}/${department.get('name').toLowerCase()}`;
    this.setState({ url });
  }

  renderMachines() {
    const machines = this.props.hierarchy.get('department').get('machines').map((mch, i) => (
      <Link className="host__label-small" key={i} to={`${this.state.url}/${mch.get('name').toLowerCase()}`}>
        <div className="department__machine-item">{mch.get('name')}</div>
      </Link>
    ));
    return (
      <div className="department__machine-container">
        {machines}
      </div>
    );
  }

  renderActiveModule() {
    const { activeModule } = this.state;
    const dataStore = this.props.data;
    const data = dataStore ? dataStore.get(activeModule.get('name').toLowerCase()) : {};
    return getComponent(activeModule.get('name'), { module: activeModule, data });
  }

  renderModules() {
    return this.props.hierarchy.get('department').get('modules').map((module, i) => {
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
      const machine = hierarchy.get('machines').find(mch => (
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
          <div
            className={`department__module-item ${this.state.activeModule ? 'host__tab' : 'host__tab-selected'}`}
            onClick={() => this.setState({ activeModule: undefined })}
          >
            Machines
          </div>
          {this.renderModules()}
        </div>
        <div className="department__content-container" >
          <div className="department__description-container">
            {description}
          </div>
          <div className="department__component-container">
            {activeModule ? this.renderActiveModule() : this.renderMachines()}
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
