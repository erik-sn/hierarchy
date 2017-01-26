import * as axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Add from 'material-ui/svg-icons/content/add';
import * as React from 'react';

import types from '../../actions/types';
import Modal from '../modal';
import DepartmentForm from './forms/admin_department_form';

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
  showNewDepartment: boolean;
}


class Department extends React.Component<IDepartmentProps, IDepartmentState> {

  constructor(props: IDepartmentProps) {
    super(props);
    this.state = {
      department: undefined,
      showNewDepartment: false,
    };
    this.createDepartment = this.createDepartment.bind(this);
    this.updateDepartment = this.updateDepartment.bind(this);
    this.toggleShowNewDepartmentForm = this.toggleShowNewDepartmentForm.bind(this);
  }

  public getDepartments(site: ISite): JSX.Element[] {
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

  public createDepartment(department: IDepartment): void {
    const departmentWithSite = department.site = this.props.site.id;
    axios.post(`${types.API}/departments/`, departmentWithSite, types.API_CONFIG)
    .then(() => this.props.message(`Department Successfully Created: ${department.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Creating Department: ${department.name}`))
    .then(() => this.resetState());
  }

  public updateDepartment(department: IDepartment): void {
    const departmentWithSite = department.site = this.props.site.id;
    axios.put(`${types.API}/departments/${department.id}/`, departmentWithSite, types.API_CONFIG)
    .then(() => this.props.message(`Department Successfully Updated: ${department.name}`))
    .then(() => this.props.fetchHierarchy())
    .catch(() => this.props.message(`Error Updating Department: ${department.name}`))
    .then(() => this.resetState());
  }

  public resetState(): void {
    this.setState({ department: undefined, showNewDepartment: false });
  }

  public toggleShowNewDepartmentForm(): void {
    this.setState({ showNewDepartment: !this.state.showNewDepartment });
  }

  public renderNewDepartment(): JSX.Element {
    return (
      <Modal
        title="Create New Department"
        onCancel={this.toggleShowNewDepartmentForm}
      >
        <DepartmentForm
          submitForm={this.createDepartment}
          modal
          new
        />
      </Modal>
    );
  }

  public renderDepartmentForm(department: IDepartment): JSX.Element {
    return (
      <DepartmentForm
        key={department.id}
        submitForm={this.updateDepartment}
        department={department}
        modules={this.props.modules}
        apicalls={this.props.apicalls}
      />
    );
  }

  public renderAddDepartmentButtion(): JSX.Element {
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
    const { department, showNewDepartment } = this.state;

    return (
      <div className="admin__department-container">
        {showNewDepartment ? this.renderNewDepartment() : undefined}
        <SelectField
          maxHeight={250}
          className="admin__form-field"
          value={department ? department.name : ''}
        >
          {this.getDepartments(site)}
        </SelectField>
        {department ? this.renderDepartmentForm(department) : this.renderAddDepartmentButtion()}
      </div>
    );
  }
}

export default Department;
