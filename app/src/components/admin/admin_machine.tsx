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
  showNewForm: boolean;
  department: IDepartment;
  machine: IMachine;
  refreshDepartment: boolean;
}

/**
 * Controller component that handles operations on the Machine object
 * 
 * @export
 * @class MachineAdmin
 * @extends {React.Component<IMachineAdminProps, IMachineAdminState>}
 */
export class MachineAdmin extends React.Component<IMachineAdminProps, IMachineAdminState> {

  constructor(props: IMachineAdminProps) {
    super(props);
    this.state = {
      showNewForm: false,
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

  /**
   * Given a site, generate a list of MenuItems that contain departmets belonging
   * to that site.
   *
   * @param {ISite} site - site to generate department list for
   * @returns {JSX.Element[]}
   *
   * @memberOf MachineAdmin
   */
  public renderDepartmentList(site: ISite): JSX.Element[] {
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

  /**
   * Given a department, generate a list of MenuItems that contain machines
   * belonging to that department
   *
   * @param {IDepartment} department - department to generate machine list for
   * @returns {JSX.Element[]}
   *
   * @memberOf MachineAdmin
   */
  public renderMachineList(department: IDepartment): JSX.Element[] {
    if (!department) {
      return [];
    }
    const machineSort = (a: IMachine, b: IMachine) => a.name > b.name ? 1 : -1;
    return department.machines.sort(machineSort).map((machine, i) => {
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

  /**
   * Set a department object as the active department
   * 
   * @param {IDepartment} department
   * 
   * @memberOf MachineAdmin
   */
  public setActiveDepartment(department: IDepartment): void {
    this.setState({ department });
  }

  /**
   * Set a machine object to as the active Machine
   *
   * @param {IMachine} machine
   *
   * @memberOf MachineAdmin
   */
  public setActiveMachine(machine: IMachine): void {
    this.setState({ machine });
  }

  /**
   * Create a machine object in thedatabase
   *
   * @param {IMachine} machine
   *
   * @memberOf MachineAdmin
   */
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

  /**
   * Update a machine object in the database
   *
   * @param {IMachine} machine
   *
   * @memberOf MachineAdmin
   */
  public updateMachine(machine: IMachine): void {
    const updatedMachine = machine;
    updatedMachine.site = this.props.site.id;
    updatedMachine.department = this.state.department.id;
    axios.put(`${types.API}/machines/${updatedMachine.id}/`, updatedMachine, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Updated: ${updatedMachine.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Machine: ${updatedMachine.name}`))
    .then(() => this.resetState());
  }

  /**
   * Toggle the state of showNewForm which controls whether or not a "New"
   * form is displayed to the user in a modal
   *
   * @memberOf MachineAdmin
   */
  public toggleShowNewMachineForm(): void {
    this.setState({ showNewForm: !this.state.showNewForm });
  }

  /**
   * Reset the component to its default state
   *
   * @memberOf MachineAdmin
   */
  public resetState(): void {
    this.setState({ machine: undefined, showNewForm: false, refreshDepartment: true });
  }

  /**
   * Render the Create form. This is an empty machine form that is displayed
   * to the user inside a Modal.
   *
   * @returns {JSX.Element}
   *
   * @memberOf MachineAdmin
   */
  public renderNewMachineForm(): JSX.Element {
    return (
      <Modal
        title="Create New Machine"
        onCancel={this.toggleShowNewMachineForm}
      >
        <MachineForm submitForm={this.createMachine} />
      </Modal>
    );
  }

  /**
   * If both a department and machine have been seleccted
   * then render a MachineForm with the machine object passed
   * as props. Otherwise prompt user to select a department/machine
   *
   * @returns {JSX.Element}
   *
   * @memberOf MachineAdmin
   */
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
    const { department, machine, showNewForm } = this.state;
    return (
      <div className="admin__machine-container">
        {showNewForm ? this.renderNewMachineForm() : undefined}
        <SelectField
          className="admin__form-field admin__department_select"
          hintText="Department"
          value={department ? department.name : ''}
        >
          {this.renderDepartmentList(site)}
        </SelectField>
        <SelectField
          className="admin__form-field admin__machine_select"
          hintText="Machine"
          value={machine ? machine.name : ''}
        >
          {this.renderMachineList(department)}
        </SelectField>
        {this.renderMenu()}
      </div>
    );
  }
}

export default MachineAdmin;
