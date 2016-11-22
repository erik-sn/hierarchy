import React, { Component } from 'react';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';

import types from '../../actions/types';
import Modal from '../modal';
import MachineForm from './forms/admin_machine_form';


export class MachineAdmin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNewMachine: false,
      department: undefined,
      machine: undefined,
    };
    this.createMachine = this.createMachine.bind(this);
    this.updateMachine = this.updateMachine.bind(this);
    this.toggleShowNewMachineForm = this.toggleShowNewMachineForm.bind(this);
  }

  getDepartments(site) {
    return site.get('departments').map((department, i) => (
      <MenuItem
        key={i}
        value={department.get('name')}
        primaryText={department.get('name')}
        onClick={() => this.setActiveDepartment(department)}
      />
    ));
  }

  getMachines(department) {
    if (!department) {
      return [];
    }
    return department.get('machines').map((machine, i) => (
      <MenuItem
        key={i}
        value={machine.get('name')}
        primaryText={machine.get('name')}
        onClick={() => this.setActiveMachine(machine)}
      />
    ));
  }

  setActiveMachine(machine) {
    this.setState({ machine });
  }

  setActiveDepartment(department) {
    this.setState({ department });
  }

  createMachine(machine) {
    const machineWithSite = machine.set('site', this.props.site.get('id'));
    const machineWithDepartment = machineWithSite.set('department', this.state.department.get('id'));
    axios.post(`${types.API}/machines/`, machineWithDepartment, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Created: ${machine.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Creating Machine: ${machine.get('name')}`))
    .then(() => this.resetState());
  }

  updateMachine(machine) {
    const machineWithSite = machine.set('site', this.props.site.get('id'));
    const machineWithDepartment = machineWithSite.set('department', this.state.department.get('id'));
    axios.put(`${types.API}/machines/${machine.get('id')}/`, machineWithDepartment, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Updated: ${machine.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Machine: ${machine.get('name')}`))
    .then(() => this.resetState());
  }

  toggleShowNewMachineForm() {
    this.setState({ showNewMachine: !this.state.showNewMachine });
  }

  resetState() {
    this.setState({ machine: undefined, showNewMachine: false });
  }

  renderNewDepartment() {
    return (
      <Modal
        title="Create New Machine"
        onCancel={this.toggleShowNewMachineForm}
      >
        <MachineForm
          submitForm={this.createMachine}
          modal
          new
        />
      </Modal>
    );
  }

  renderMenu() {
    const { department, machine } = this.state;
    if (department && machine) {
      return (
        <MachineForm
          submitForm={this.updateMachine}
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

  render() {
    const { site } = this.props;
    const { department, machine, showNewMachine } = this.state;
    return (
      <div className="admin__machine-container">
        {showNewMachine ? this.renderNewDepartment() : undefined}
        <SelectField
          className="admin__form-field admin__department_select"
          hintText="Department"
          label="Department"
          value={department ? department.get('name') : ''}
        >
          {this.getDepartments(site)}
        </SelectField>
        <SelectField
          className="admin__form-field admin__machine_select"
          hintText="Machine"
          label="Machine"
          value={machine ? machine.get('name') : ''}
        >
          {this.getMachines(department)}
        </SelectField>
        {this.renderMenu()}
      </div>
    );
  }
}

export default MachineAdmin;
