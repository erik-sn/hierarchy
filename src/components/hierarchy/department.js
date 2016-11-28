import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Machine from './machine';
import getComponent from '../../utils/library';

import { fetchDepartmentData } from '../../actions/index';


class Department extends Component {

  constructor(props) {
    super(props);
    this.site = props.hierarchy.get('site');
    this.department = props.hierarchy.get('department');
    this.machines = this.department.get('machines').sort((a, b) => a > b);
    this.url = `/${this.site.get('code').toLowerCase()}/${this.department.get('name').toLowerCase()}`;
    this.state = {
      activeModule: undefined,
    };
  }

  componentDidMount() {
    this.department.get('apiCalls').forEach((apiCall) => {
      this.props.fetchDepartmentData(this.department.get('id'), apiCall.get('url'), apiCall.get('key'));
    });
  }

  renderMachines() {
    const machines = this.machines.map((mch, i) => (
      <Link key={i} to={`${this.url}/${mch.get('name').toLowerCase()}`}>
        <div >{mch.get('name')}</div>
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
    const data = this.props.data.get(activeModule.get('name').toLowerCase());
    return getComponent(activeModule.get('name'), { module: activeModule, data });
  }

  renderModules() {
    return this.department.get('modules').map((module, i) => (
      <div
        className="department__module-item"
        onClick={() => this.setState({ activeModule: module })}
        key={i}
      >
        {module.get('label')}
      </div>
    ));
  }

  render() {
    const { activeModule } = this.state;
    const { params, data } = this.props;
    if (params.machine) {
      const machine = this.department.get('machines').find(mch => (
        mch.get('name').toLowerCase() === params.machine.toLowerCase()
      ));
      return (
        <Machine machine={machine} data={data} />
      );
    }

    return (
      <div className="department__container">
        <div className="department__module-container">
          <div
            className="department__module-item"
            onClick={() => this.setState({ activeModule: undefined })}
          >
            Machines
          </div>
          {this.renderModules()}
        </div>
        <div className="department__content-container" >
          {activeModule ? this.renderActiveModule() : this.renderMachines()}
        </div>
      </div>
    );
  }
}

Department.propTypes = {
  data: PropTypes.object.isRequired,
  hierarchy: PropTypes.object,
  fetchDepartmentData: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.hierarchy.get('department').get('id');
  return { data: state.get('data').get(id) };
}

export default connect(mapStateToProps, { fetchDepartmentData })(Department);
