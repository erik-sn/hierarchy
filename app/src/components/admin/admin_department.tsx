import * as axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Add from 'material-ui/svg-icons/content/add';
import * as React from 'react';

import types from '../../actions/types';
import Modal from '../modal';
import DepartmentForm from './forms/department_form';

import { IApiCall, IDepartment, IModule, ISite } from '../../constants/interfaces';

export interface IDepartmentProps {
  fetchHierarchy: () => void;
  message: (message: string) => void;
  site: ISite;
  apicalls: IApiCall[];
  modules: IModule[];
}

export interface IDepartmentState {
  department: IDepartment;
  showNewForm: boolean;
}


/**
 * Controller component that handles operations on Department objects
 * 
 * @class Department
 * @extends {React.Component<IDepartmentProps, IDepartmentState>}
 */
class Department extends React.Component<IDepartmentProps, IDepartmentState> {

  constructor(props: IDepartmentProps) {
    super(props);
    this.state = {
      department: undefined,
      showNewForm: false,
    };
    this.createDepartment = this.createDepartment.bind(this);
    this.updateDepartment = this.updateDepartment.bind(this);
    this.toggleShowNewDepartmentForm = this.toggleShowNewDepartmentForm.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  /**
   * Given a site object, render all of its departments into MenuItems
   * 
   * @param {ISite} site - site object to retrieve departments from
   * @returns {JSX.Element[]}
   * 
   * @memberOf Department
   */
  public renderDepartmentList(site: ISite): JSX.Element[] {
    return site.departments.map((department, i) => {
      const onDepartmentClick = () => this.setState({ department });
      return (
        <MenuItem
          key={i}
          value={department.name}
          primaryText={department.name}
          onTouchTap={onDepartmentClick}
        />
      );
    });
  }

  /**
   * Create a department object
   * 
   * @param {IDepartment} department
   * 
   * @memberOf Department
   */
  public createDepartment(department: IDepartment): void {
    const departmentWithSite = department;
    departmentWithSite.site = this.props.site.id;
    console.log(types.API_CONFIG);
    axios.post(`${types.API}/departments/`, departmentWithSite, types.API_CONFIG)
    .then(() => this.props.message(`Department Successfully Created: ${department.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Creating Department: ${department.name}`))
    .then(() => this.resetState());
  }

  /**
   * Update a department object
   * 
   * @param {IDepartment} department
   * 
   * @memberOf Department
   */
  public updateDepartment(department: IDepartment): void {
    const departmentWithSite = department;
    departmentWithSite.site = this.props.site.id;
    axios.put(`${types.API}/departments/${department.id}/`, departmentWithSite, types.API_CONFIG)
    .then(() => this.props.message(`Department Successfully Updated: ${department.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Department: ${department.name}`))
    .then(() => this.resetState());
  }

  /**
   * Reset the component back to default state
   * 
   * @memberOf Department
   */
  public resetState(): void {
    this.setState({ department: undefined, showNewForm: false });
  }

  /**
   * Toggle the showNewForm state which controls whether or not a
   * Modal containing an empty department form is rendered 
   * 
   * @memberOf Department
   */
  public toggleShowNewDepartmentForm(): void {
    this.setState({ showNewForm: !this.state.showNewForm });
  }

  /**
   * Render the Create form. This is a a clean department form
   * inside a modal object
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf Department
   */
  public renderNewDepartment(): JSX.Element {
    return (
      <Modal
        title="Create New Department"
        onCancel={this.toggleShowNewDepartmentForm}
      >
        <DepartmentForm submitForm={this.createDepartment} />
      </Modal>
    );
  }

  /**
   * Render the edit form. This is aa department form with values 
   * corresponding to the parameter department. Rendered inside a 
   * Modal
   * 
   * @param {IDepartment} department - department to edit/delete
   * @returns {JSX.Element}
   * 
   * @memberOf Department
   */
  public renderUpdateDepartmentForm(department: IDepartment): JSX.Element {
    return (
      <DepartmentForm
        key={department.id}
        submitForm={this.updateDepartment}
        department={department}
        modules={this.props.modules}
        apiCalls={this.props.apicalls}
        cancel={this.resetState}
      />
    );
  }

  /**
   * JSX helper method that renders the add button
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf Department
   */
  public renderAddDepartmentButton(): JSX.Element {
    return (
      <FlatButton
        onClick={this.toggleShowNewDepartmentForm}
        label="Add Department"
        icon={<Add />}
        primary
      />
    );
  }

  public render(): JSX.Element {
    const { site } = this.props;
    const { department, showNewForm } = this.state;

    return (
      <div className="admin__department-container">
        {showNewForm ? this.renderNewDepartment() : undefined}
        <SelectField
          maxHeight={250}
          className="admin__form-field"
          value={department ? department.name : ''}
        >
          {this.renderDepartmentList(site)}
        </SelectField>
        {department ? this.renderUpdateDepartmentForm(department) : this.renderAddDepartmentButton()}
      </div>
    );
  }
}

export default Department;
