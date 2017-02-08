
import { List } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Close from 'material-ui/svg-icons/navigation/close';
import * as React from 'react';

import { IHierarchyTier, IModule } from '../../../constants/interfaces';

export interface IModuleEditState {
  modules: IModule[];
  defaultId: number;
}

export interface IModuleEditProps {
  parentObject: IHierarchyTier;
  change: (key: string, value: any) => void;
  modules: IModule[];
}


/**
 * This component represents an interface that allows the user to
 * add or remove existing modules to a parent component. It is
 * designed to be generic in its implementation so any HierarchyTier
 * could potentially use it.
 * 
 * @class ModuleEdit
 * @extends {React.Component<IModuleEditProps, IModuleEditState>}
 */
class ModuleEdit extends React.Component<IModuleEditProps, IModuleEditState> {

  constructor(props: IModuleEditProps) {
    super(props);
    this.state = {
      modules: props.parentObject.modules,
      defaultId: props.parentObject.defaultModule ? props.parentObject.defaultModule.id : -1,
    };
  }

  public componentWillMount() {
    // initialize the form with the parent's module information
    const moduleIds = this.props.parentObject.modules.map((mdl) => mdl.id);
    this.props.change('modules', moduleIds);
    if (this.props.parentObject.defaultModule) {
      this.props.change('defaultModule', this.props.parentObject.defaultModule.id);
    }
  }


  /**
   * Add a module to the parent
   * 
   * @param {IModule} module - module being added
   * 
   * @memberOf ModuleEdit
   */
  public handleAddModule(module: IModule): void {
    // In order to avoid duplicates filter off any modules that have the same id as the one
    // we are creating - then push the new module to the array. If it is the only module
    // in the array set it as the defaultModule.
    const filteredModules: IModule[] = this.state.modules.filter((mdl) => mdl.id !== module.id);
    filteredModules.push(module);
    this.updateForm(filteredModules);
    if (filteredModules.length === 1) {
      this.updateDefaultModule(module.id);
    }
  }

  /**
   * Delete a module from the parent
   * 
   * @param {IModule} module - module to delete
   * 
   * @memberOf ModuleEdit
   */
  public handleDeleteModule(module: IModule): void {
    const modules = this.state.modules.filter((mdl) => mdl.id !== module.id);
    this.updateForm(modules);
    // if there are no modules left set the default to null
    if (modules.length === 0) {
      this.updateDefaultModule(null);
    } else {
      // if the default module was the one that was deleted then
      // set the first remaining module as default
      this.updateDefaultModule(modules[0].id);
    }
  }

  /**
   * Update the parent's from with a list of module primary keys
   * using the change function provided by redux form.
   * 
   * @param {IModule[]} modules - modules that will be set into the parent's
   * module list
   * 
   * @memberOf ModuleEdit
   */
  public updateForm(modules: IModule[]): void {
    const moduleIds = modules.map((mdl) => mdl.id);
    this.setState({ modules }, () => {
      this.props.change('modules', moduleIds);
    });
  }

  /**
   * Update the parent's default module. This module will appear
   * first in the module list to the users.
   * 
   * @param {number} defaultId - primary key of the default module
   * 
   * @memberOf ModuleEdit
   */
  public updateDefaultModule(defaultId: number): void {
    this.setState({ defaultId }, () => (
      this.props.change('defaultModule', defaultId)
    ));
  }

  /**
   * Generate a list of MenuItems that represent modules that
   * belong to the parent.
   * 
   * @param {IModule[]} modules - parent's current modules
   * @returns {JSX.Element[]}
   * 
   * @memberOf ModuleEdit
   */
  public renderModuleMenu(modules: IModule[]): JSX.Element[] {
    const { defaultId } = this.state;
    return modules.map((module, i) => {
      const handleBodyClick = () => this.updateDefaultModule(module.id);
      const handleCloseClick = () => this.handleDeleteModule(module);
      return (
        <MenuItem
          key={i}
          onTouchTap={handleBodyClick}
          className={defaultId === module.id ? 'admin__modules-default' : undefined}
          value={module.name}
          primaryText={module.name}
          rightIcon={<Close onClick={handleCloseClick} />}
        />
      );
    });
  }

  /**
   * Generate a list of MenuItems that represent the available
   * modules that are available to add to the parent.
   * 
   * @param {IModule[]} modules - available modules
   * @returns {JSX.Element[]}
   * 
   * @memberOf ModuleEdit
   */
  public renderModuleListItems(modules: IModule[]): JSX.Element[] {
    return modules.map((module, i) => {
      const handleListItemClick = () => this.handleAddModule(module);
      return (
        <MenuItem
          key={i}
          value={module.name}
          primaryText={module.name}
          onClick={handleListItemClick}
        />
      );
    });
  }

  public render(): JSX.Element {
    const { modules, defaultId } = this.state;
    return (
      <div className="admin__module-edit">
        <h3>Modules</h3>
        <List>
          {modules && modules.length === 0 ? <div className="admin__message" >No Modules</div> : ''}
          {this.renderModuleMenu(modules)}
        </List>
        <SelectField
          style={{ width: '100%' }}
          hintText="Add Module"
          maxHeight={300}
        >
          {this.props.modules ? this.renderModuleListItems(this.props.modules) : undefined}
        </SelectField>
      </div>
    );
  }
}


export default ModuleEdit;
