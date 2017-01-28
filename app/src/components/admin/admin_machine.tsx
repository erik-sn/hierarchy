import * as axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Add from 'material-ui/svg-icons/content/add';
import * as React from 'react';

import types from '../../actions/types';
import { IApiCall, IAxiosResponse, IDepartment, IMachine, IModule, ISite } from '../../constants/interfaces';
import Modal from '../modal';
import MachineForm from './forms/machine_form';

export interface IMachineAdminProps {
  site: ISite;
  message: (messageText: string) => void;
  fetchHierarchy: () => void;
  modules: IModule[];
}

export interface IMachineAdminState {
  showNewMachine: boolean;
  department: IDepartment;
  machine: IMachine;
  refreshDepartment: boolean;
}

export class MachineAdmin extends React.Component<IMachineAdminProps, IMachineAdminState> {

  constructor(props: IMachineAdminProps) {
    super(props);
    this.state = {
      showNewMachine: false,
      department: undefined,
      machine: undefined,
      refreshDepartment: false,
    };
    this.createMachine = this.createMachine.bind(this);
    this.updateMachine = this.updateMachine.bind(this);
    this.toggleShowNewMachineForm = this.toggleShowNewMachineForm.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  public componentWillUpdate(nextProps: IMachineAdminProps) {
    const { department } = this.state;

    // after a machine is created/updated we set refreshDepartment to indicate that
    // the current department is no longer up to date. If a new set of props comes
    // through and that setting is in place, find the department with the same id
    // and update state to reflect the changes
    if (department && this.state.refreshDepartment) {
      const updatedDepartment = nextProps.site.departments.find((nextDepartment) => (
        department.id === nextDepartment.id
      ));
      this.setState({ department: updatedDepartment, refreshDepartment: false });
    }
  }

  public getDepartments(site: ISite): JSX.Element[] {
    return site.departments.map((department, i) => {
      const departmentItemClick = () => this.setActiveDepartment(department);
      return (
        <MenuItem
          key={i}
          value={department.name}
          primaryText={department.name}
          onClick={departmentItemClick}
        />
      );
    });
  }

  public getMachines(department: IDepartment): JSX.Element[] {
    if (!department) {
      return [];
    }
    return department.machines.map((machine, i) => {
      const machineItemClick = () => this.setActiveMachine(machine);
      return (
        <MenuItem
          key={i}
          value={machine.name}
          primaryText={machine.name}
          onClick={machineItemClick}
        />
      );
    });
  }

  public setActiveMachine(machine: IMachine): void {
    this.setState({ machine });
  }

  public setActiveDepartment(department: IDepartment): void {
    this.setState({ department });
  }

  public createMachine(machine: IMachine): void {
    const updatedMachine = machine;
    updatedMachine.site =  this.props.site.id;
    updatedMachine.department = this.state.department.id;
    axios.post(`${types.API}/machines/`, updatedMachine, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Created: ${updatedMachine.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Creating Machine: ${updatedMachine.name}`))
    .then(() => this.resetState());
  }

  public updateMachine(machine: IMachine): void {
    const updatedMachine = machine;
    updatedMachine.site =  this.props.site.id;
    updatedMachine.department = this.state.department.id;
    axios.put(`${types.API}/machines/${machine.id}/`, updatedMachine, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Updated: ${machine.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Machine: ${machine.name}`))
    .then(() => this.resetState());
  }

  public toggleShowNewMachineForm(): void {
    this.setState({ showNewMachine: !this.state.showNewMachine });
  }

  public resetState(): void {
    this.setState({ machine: undefined, showNewMachine: false, refreshDepartment: true });
  }

  public renderNewMachine(): JSX.Element {
    return (
      <Modal
        title="Create New Machine"
        onCancel={this.toggleShowNewMachineForm}
      >
        <MachineForm submitForm={this.createMachine} />
      </Modal>
    );
  }

  public renderMenu(): JSX.Element {
    const { department, machine } = this.state;
    if (department && machine) {
      return (
        <MachineForm
          submitForm={this.updateMachine}
          cancel={this.resetState}
          machine={machine}
          modules={this.props.modules}
        />
      );
    } else if (department) {
      return (
        <FlatButton
          onClick={this.toggleShowNewMachineForm}
          label="Add Machine"
          icon={<Add />}
          primary
        />
      );
    }
    return <h3>Select a Department</h3>;
  }

  public render(): JSX.Element {
    const { site } = this.props;
    const { department, machine, showNewMachine } = this.state;
    return (
      <div className="admin__machine-container">
        {showNewMachine ? this.renderNewMachine() : undefined}
        <SelectField
          className="admin__form-field admin__department_select"
          hintText="Department"
          value={department ? department.name : ''}
        >
          {this.getDepartments(site)}
        </SelectField>
        <SelectField
          className="admin__form-field admin__machine_select"
          hintText="Machine"
          value={machine ? machine.name : ''}
        >
          {this.getMachines(department)}
        </SelectField>
        {this.renderMenu()}
      </div>
    );
  }
}

export default MachineAdmin;
