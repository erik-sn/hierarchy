import * as React from 'react';
import { connect } from 'react-redux';

import getComponent from '../../utils/library';
import NotFound from '../notfound';
import Machine from './machine';

import { fetchDepartmentData } from '../../actions/index';
import { IAction, IDepartment, IMachine, IModule, IReduxState, ISite } from '../../constants/interfaces';
import renderModules, { retrieveModule } from './renderModules';

interface IHierarchy {
  site: ISite;
  department: IDepartment;
  machine: IMachine;
}

interface IParams {
  machine?: string;
  module?: string;
  department?: string;
  site?: string;
}

export interface IDepartmentProps {
  departmentDataStore: any;
  hierarchy: IHierarchy;
  fetchDepartmentData: (id: number, url: string, key: string) => IAction;
  params: IParams;
  notFound: boolean;
}

export interface IDepartmentState {
  activeModule: IModule;
  url: string;
}

class Department extends React.Component<IDepartmentProps, IDepartmentState> {

  constructor(props: IDepartmentProps) {
    super(props);
    const department = props.hierarchy.department;
    const module = props.params.module;
    this.state = {
      activeModule: module ? retrieveModule(department, module) : department.defaultModule,
      url: `${window.location.pathname}/${department.name.toLowerCase()}`,
    };
    this.setActiveModule = this.setActiveModule.bind(this);
  }

  public componentDidMount() {
    const { hierarchy } = this.props;
    // apiCall objects are stored in the department hierarchy in the
    // databse. Iterate over each api call and update an index of redux
    // state with the data from the response
    hierarchy.department.apiCalls.forEach((apiCall) => {
      this.props.fetchDepartmentData(hierarchy.department.id, apiCall.url, apiCall.key);
    });
  }

  public componentWillReceiveProps(nextProps: IDepartmentProps) {
    const nextDepartment = nextProps.hierarchy.department;
    const url = window.location.pathname;

    // start at the default module, if the react-router params have a module
    // then search for that module in the department
    let activeModule = nextDepartment.defaultModule;
    if (nextProps.params.module) {
      activeModule = retrieveModule(nextDepartment, nextProps.params.module);
    }
    this.setState({ url, activeModule });
  }

  public setActiveModule(activeModule: IModule) {
    this.setState({ activeModule });
  }

  public renderActiveModule() {
    const { departmentDataStore, hierarchy } = this.props;
    const { activeModule } = this.state;
    const componentProps = {
      key: hierarchy.department.id,
      type: 'department',
      parent: hierarchy.department,
      module: activeModule,
      departmentDataStore,
    };
    return getComponent(activeModule.name, componentProps);
  }

  public renderDescriptionContainer(description: string): JSX.Element {
    return (
      <div className="display__description-container">
        {description}
      </div>
    );
  }

  public render() {
    const { params, departmentDataStore, hierarchy, notFound } = this.props;
    if (notFound) {
      return <NotFound />;
    }
    const { activeModule } = this.state;
    if (params.machine) {
      return (
        <Machine
          departmentDataStore={departmentDataStore}
          hierarchy={hierarchy}
          activeModuleLabel={params.module}
        />
      );
    }
    const description = activeModule ? activeModule.description : '';
    return (
      <div className="display__container">
        <div className="display__module-container">
          {renderModules(activeModule, hierarchy.department, this.setActiveModule)}
        </div>
        <div className="display__content-container" >
          {description.trim() !== '' ? this.renderDescriptionContainer(description) : undefined}
          <div className="display__component-container">
            {!activeModule ? <h3 style={{ textAlign: 'center' }}>No Modules Available</h3> : this.renderActiveModule()}
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state: IReduxState, ownProps: IDepartmentProps) {
  if (!ownProps.hierarchy) {
    return { notFound: true };
  }
  const id = ownProps.hierarchy.department.id;
  return { departmentDataStore: state.departmentStores[id] };
}

export default connect<{}, {}, IDepartmentProps>(mapStateToProps, { fetchDepartmentData })(Department);
