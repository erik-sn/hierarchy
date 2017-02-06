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
import Modal from '../modal';
import ModuleForm, { FORM_NAME } from './forms/module_form';

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
  showNewForm: boolean;
}

/**
 * Controller for operations on Module objects
 * 
 * @export
 * @class ModuleAdmin
 * @extends {React.Component<IModulesProps, IModulesState>}
 */
export class ModuleAdmin extends React.Component<IModulesProps, IModulesState> {

  constructor(props: IModulesProps) {
    super(props);
    this.state = {
      modules: undefined,
      activeModule: undefined,
      messageText: '',
      messageShow: false,
      filter: '',
      showNewForm: false,
    };
    this.createModule = this.createModule.bind(this);
    this.updateModule = this.updateModule.bind(this);
    this.deleteModule = this.deleteModule.bind(this);
    this.resetState = this.resetState.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleModuleFilter = this.handleModuleFilter.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.fetchModules = this.fetchModules.bind(this);
    this.toggleShowNewForm = this.toggleShowNewForm.bind(this);
  }

  public componentDidMount(): void {
    this.fetchModules();
  }

  /**
   * Retrieve a list of all modules in the database
   * 
   * @memberOf ModuleAdmin
   */
  public fetchModules(): void {
    axios.get(`${types.API}/modules/?inactive=true`, types.API_CONFIG)
    .then(({ data }: IAxiosResponse) => {
      this.setState({ modules: data as IModule[] });
    });
  }

  /**
   * Create a module in the database
   * 
   * @memberOf ModuleAdmin
   */
  public createModule(): void {
    const moduleForm: IModule = this.props.moduleForm;
    axios.post(`${types.API}/modules/`, moduleForm, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Created: ${moduleForm.name}`))
    .catch(() => this.showMessage(`Error Creating Module: ${moduleForm.name}`))
    .then(() => this.resetState());
  }

  /**
   * Update a module in the database
   * 
   * @memberOf ModuleAdmin
   */
  public updateModule(): void {
    const moduleForm: IModule = this.props.moduleForm;
    axios.put(`${types.API}/modules/${this.state.activeModule.id}/`, moduleForm, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Updated: ${this.state.activeModule.name}`))
    .catch(() => this.showMessage(`Error Updating Module: ${this.state.activeModule.name}`))
    .then(() => this.resetState());
  }

  /**
   * Delete a module from the database
   * 
   * @memberOf ModuleAdmin
   */
  public deleteModule(): void {
    axios.delete(`${types.API}/modules/${this.state.activeModule.id}/`, types.API_CONFIG)
    .then(() => this.fetchModules())
    .then(() => this.showMessage(`Module Successfully Deleted: ${this.state.activeModule.name}`))
    .catch(() => this.showMessage(`Error Deleting Module: ${this.state.activeModule.name}`))
    .then(() => this.resetState());
  }

  /**
   * Reset the component back to default state
   * 
   * @memberOf ModuleAdmin
   */
  public resetState(): void {
    this.setState({
      activeModule: undefined,
      showNewForm: false,
    });
  }

  /**
   * Show a message inside a Snackbar to the user
   * 
   * @param {string} messageText - text to show
   * 
   * @memberOf ModuleAdmin
   */
  public showMessage(messageText: string): void {
    this.setState({
      messageShow: true,
      messageText,
    });
  }

  /**
   * Close the Snackbar message
   * 
   * @memberOf ModuleAdmin
   */
  public handleMessageClose(): void {
    this.setState({ messageShow: false });
  }

  /**
   * Set the list filter to the value of the user input in the filter
   * TextField
   * 
   * @param {React.FormEvent<HTMLInputElement>} event
   * 
   * @memberOf ModuleAdmin
   */
  public handleModuleFilter(event: React.FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    this.setState({
      filter: event.currentTarget.value,
    });
  }

  /**
   * Filter the modules stored in state by the user input in the filter
   * field.
   * 
   * @returns {IModule[]}
   * 
   * @memberOf ModuleAdmin
   */
  public filterModules(): IModule[] {
    const { modules, filter } = this.state;
    if (filter.trim()) {
      return modules.filter((module: IModule) => (
        module.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
        module.description.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ));
    }
    return modules;
  }

  /**
   * Generate a list of ListItems that contain module information.
   * 
   * @returns {JSX.Element[]}
   * 
   * @memberOf ModuleAdmin
   */
  public generateModuleList(): JSX.Element[] {
    return this.filterModules().map((module, i) => {
      const clickModuleItem = () => this.setState({ activeModule: module });
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

  /**
   * Toggle the state of showNewForm which controls the Modal
   * element
   * 
   * @memberOf ModuleAdmin
   */
  public toggleShowNewForm(): void {
    this.setState({
      activeModule: undefined,
      showNewForm: !this.state.showNewForm,
    });
  }

  /**
   * Render the Create form. This is an empty form rendered
   * inside a Modal object for creation of new module objects.
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf ModuleAdmin
   */
  public renderNewModuleForm(): JSX.Element {
    return (
      <Modal
        title="Create New Module"
        onCancel={this.toggleShowNewForm}
      >
        <ModuleForm
          submitForm={this.createModule}
        />
      </Modal>
    );
  }

  /**
   * Render the Edit form. This form is passed the activeModule
   * which is used to set intial values in the form.
   * 
   * @returns {JSX.Element}
   * 
   * @memberOf ModuleAdmin
   */
  public renderUpdateModuleForm(): JSX.Element {
    return (
      <ModuleForm
        module={this.state.activeModule}
        submitForm={this.updateModule}
        remove={this.deleteModule}
      />
    );
  }

  public render(): JSX.Element {
    const { activeModule, modules, showNewForm } = this.state;
    if (!modules) {
      return (
        <div className="admin__modules">
          <Loader />
        </div>
      );
    }
    return (
      <div className="admin__modules">
        {showNewForm ? this.renderNewModuleForm() : undefined}
        <div className="admin__modules-inner-container">
          <div className="admin__modules-list-container">
            <TextField
              id="admin__modules-filter"
              hintText="Module Filter"
              value={this.state.filter}
              onChange={this.handleModuleFilter}
            />
            <List style={{ maxHeight: '400px', overflowY: 'auto' }} >
              {this.generateModuleList()}
            </List>
            <div
              className="admin__modules-new-module-container"
              onClick={this.toggleShowNewForm}
            >
              <Add />
              <span>New Module</span>
            </div>
          </div>
          <div className="admin__modules-form-container">
            {activeModule ? this.renderUpdateModuleForm() : <h3>Select a Module</h3>}
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


/**
 * Initialize the form using Redux state
 * 
 * @param {IReduxState} state
 * @returns
 */
function mapStateToProps(state: IReduxState) {
  if (!state.form[FORM_NAME]) {
      return { moduleForm: {} };
    }
  return { moduleForm: state.form[FORM_NAME].values || {} };
}

export default connect<{}, {}, IModulesProps>(mapStateToProps)(ModuleAdmin);
