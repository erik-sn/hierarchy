import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add';

import types from '../../actions/types';
import Modal from '../modal';
import MachineForm from './forms/admin_machine_form';


/**
 *  Controller UI for the admin machine interface.
 *
 * @export
 * @class MachineAdmin
 * @extends {Component}
 */
export class MachineAdmin extends Component {

  /**
   * Creates an instance of MachineAdmin.
   *
   * @param {object} props
   *
   * @memberOf MachineAdmin
   */
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

  /**
   * Retrieve departments from a site object and return them
   * as a list of MenuItems
   *
   * @param {object} site
   * @returns
   *
   * @memberOf MachineAdmin
   */
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

  /**
   * Retrieve machines from the department object and return
   * them as a list of MenuItems
   *
   * @param {object} department
   * @returns
   *
   * @memberOf MachineAdmin
   */
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

  /**
   * set the activeMachine state
   *
   * @param {object} machine
   *
   * @memberOf MachineAdmin
   */
  setActiveMachine(machine) {
    this.setState({ machine });
  }

  /**
   * set the activeDepartment state
   *
   * @param {object} department
   *
   * @memberOf MachineAdmin
   */
  setActiveDepartment(department) {
    this.setState({ department });
  }

  /**
   * Given a machine object set the active site and department's id's as their
   * corresponding key - the API accepts these as foreign keys. POST the object
   * to the API and display the result to the user.
   *
   * @param {object} machine
   *
   * @memberOf MachineAdmin
   */
  createMachine(machine) {
    const machineWithSite = machine.set('site', this.props.site.get('id'));
    const machineWithDepartment = machineWithSite.set('department', this.state.department.get('id'));
    axios.post(`${types.API}/machines/`, machineWithDepartment, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Created: ${machine.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Creating Machine: ${machine.get('name')}`))
    .then(() => this.resetState());
  }

  /**
   * Given a machine object set the active site and department's id's as their
   * corresponding key - the API accepts these as foreign keys. PUT the object
   * to the API to update it in the database and display the result to the user.
   *
   * @param {any} machine
   *
   * @memberOf MachineAdmin
   */
  updateMachine(machine) {
    const machineWithSite = machine.set('site', this.props.site.get('id'));
    const machineWithDepartment = machineWithSite.set('department', this.state.department.get('id'));
    axios.put(`${types.API}/machines/${machine.get('id')}/`, machineWithDepartment, types.API_CONFIG)
    .then(() => this.props.message(`Machine Successfully Updated: ${machine.get('name')}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Machine: ${machine.get('name')}`))
    .then(() => this.resetState());
  }

  /**
   * Toggle showing the newMachine modal
   *
   * @memberOf MachineAdmin
   */
  toggleShowNewMachineForm() {
    this.setState({ showNewMachine: !this.state.showNewMachine });
  }

  /**
   * reset component state back to defaults
   *
   * @memberOf MachineAdmin
   */
  resetState() {
    this.setState({ machine: undefined, showNewMachine: false });
  }

  /**
   * Render a machine form with the new prop to start a fresh machine. Set this
   * form inside a modal.
   *
   * @returns JSX.Element
   *
   * @memberOf MachineAdmin
   */
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

  /**
   * Render either a machine form with the active machine object
   * set as the default values, or just a button prompting the
   * user to add a machine if there is no active machine
   *
   * @returns JSX.Element
   *
   * @memberOf MachineAdmin
   */
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

MachineAdmin.propTypes = {
  site: PropTypes.object.isRequired,
  message: PropTypes.func.isRequired,
  fetchHierarchy: PropTypes.func.isRequired,
  modules: PropTypes.object,
};

export default MachineAdmin;
