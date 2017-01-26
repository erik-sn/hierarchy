import * as axios from 'axios';
import { fromJS, Map  } from 'immutable';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Add from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { connect } from 'react-redux';

import types from '../../actions/types';
import { IAxiosResponse, IModule, IReduxState } from '../../constants/interfaces';
import Loader from '../loader';
import ModuleForm, { FORM_NAME } from './forms/admin_module_form';

export interface IModulesProps {
  module?: IModule;
  moduleForm?: IModule;
}

export interface IModulesState {
  modules: IModule[];
  activeModule: IModule;
  messageText: string;
  messageShow: boolean;
  filter: string;
  clean: boolean;
}

export class Modules extends React.Component<IModulesProps, IModulesState> {

  constructor(props: IModulesProps) {
    super(props);
    this.state = {
      modules: undefined,
      activeModule: undefined,
      messageText: '',
      messageShow: false,
      filter: '',
      clean: true,
    };
    this.createModule = this.createModule.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this.deleteModule = this.deleteModule.bind(this);
    this.resetState = this.resetState.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.showCleanModuleForm = this.showCleanModuleForm.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.fetchModules = this.fetchModules.bind(this);
  }

  public componentDidMount(): void {
    this.fetchModules();
  }

  public fetchModules(): void {
    axios.get(`${types.API}/modules/?inactive=true`, types.API_CONFIG)
    .then(({ data }: IAxiosResponse) => {
      this.setState({ modules: fromJS(data) });
    });
  }

  public createModule(): void {
    const moduleForm: IModule = this.props.module;
    axios.post(`${types.API}/modules/`, moduleForm, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Created: ${moduleForm.name}`))
    .catch(() => this.showMessage(`Error Updating Module: ${moduleForm.name}`))
    .then(() => this.resetState());
  }

  public updateModule(): void {
    const moduleForm: IModule = this.props.module;
    axios.put(`${types.API}/modules/${this.state.activeModule.id}/`, moduleForm, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Updated: ${this.state.activeModule.name}`))
    .catch(() => this.showMessage(`Error Updating Module: ${this.state.activeModule.name}`))
    .then(() => this.resetState());
  }

  public deleteModule(): void {
    axios.delete(`${types.API}/modules/${this.state.activeModule.id}/`, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Deleted: ${this.state.activeModule.name}`))
    .catch(() => this.showMessage(`Error Deleting Module: ${this.state.activeModule.name}`))
    .then(() => this.resetState());
  }

  public resetState(): void {
    this.setState({
      activeModule: undefined,
      clean: false,
    });
  }

  public showMessage(messageText: string): void {
    this.setState({
      messageShow: true,
      messageText,
    });
  }

  public handleMessageClose(): void {
    this.setState({ messageShow: false });
  }

  public handleFilter(event: React.FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    this.setState({
      filter: event.currentTarget.value,
    });
  }

  public showCleanModuleForm(): void {
    const newModule: IModule = {
      id: null,
      name: '',
      label: '',
      description: '',
      active: true,
      created: null,
      modified: null,
    };
    this.setState({ activeModule: newModule, clean: true });
  }

  public generateModules(): JSX.Element[] {
    const { modules, filter } = this.state;
    let filteredModules = modules;
    if (filter.trim()) {
      filteredModules = modules.filter((module: IModule) => (
        module.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
        module.description.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ));
    }
    return filteredModules.map((module, i) => {
      const clickModuleItem = () => this.setState({ activeModule: module, clean: false });
      return (
        <ListItem
          key={i}
          onClick={clickModuleItem}
          primaryText={module.name}
          secondaryText={module.description}
        />
      );
    });
  }

  public renderModuleForm(): JSX.Element {
    if (this.state.activeModule) {
      return (
        <ModuleForm
          module={this.state.activeModule}
          submitForm={this.updateModule}
          create={this.createModule}
          update={this.updateModule}
          remove={this.deleteModule}
          clear={this.resetState}
          clean={this.state.clean}
        />
      );
    }
    return <h3 style={{ textAlign: 'center' }}>Select a Module</h3>;
  }

  public render(): JSX.Element {
    const { modules } = this.state;
    if (!modules) {
      return (
        <div className="admin__modules">
          <Loader />
        </div>
      );
    }

    return (
      <div className="admin__modules">
        <div className="admin__modules-inner-container">
          <div className="admin__modules-list-container">
            <TextField
              id="admin__modules-filter"
              hintText="Module Filter"
              value={this.state.filter}
              onChange={this.handleFilter}
            />
            <List>
              {this.generateModules()}
            </List>
            <div
              className="admin__modules-new-module-container"
              onClick={this.showCleanModuleForm}
            >
              <Add />
              <span>New Module</span>
            </div>
          </div>
          <div className="admin__modules-form-container">
            {this.renderModuleForm()}
          </div>
        </div>
        <Snackbar
          open={this.state.messageShow}
          message={this.state.messageText}
          action="Ok"
          autoHideDuration={10000}
          onActionTouchTap={this.handleMessageClose}
          onRequestClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  const reduxState: IReduxState = state.toJS();
  if (!reduxState.form[FORM_NAME]) {
      return { moduleForm: {} };
    }
  return {
    moduleForm: reduxState.form[FORM_NAME].values || {},
  };
}

export default connect<{}, {}, IModulesProps>(mapStateToProps)(Modules);
