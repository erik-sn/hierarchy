
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
  }

  public handleAddModule(module: IModule): void {
    if (!module) {
      return;
    }
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

  public handleDeleteModule(module: IModule): void {
    if (!module) {
      return;
    }
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

  public updateForm(modules: IModule[]): void {
    const moduleIds = modules.map((mdl) => mdl.id);
    this.setState({ modules }, () => {
      this.props.change('modules', moduleIds);
    });
  }

  public updateDefaultModule(defaultId: number): void {
    this.setState({ defaultId }, () => (
      this.props.change('defaultModule', defaultId)
    ));
  }

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
          {this.props.modules ? this.renderModuleListItems(this.props.modules) : ''}
        </SelectField>
      </div>
    );
  }
}


export default ModuleEdit;
