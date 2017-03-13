import { Map } from 'immutable';
import * as React from 'react';
import { spring } from 'react-motion';
import { connect } from 'react-redux';

import { IDepartment, IMachine, IModule, IReduxState, ISite } from '../../constants/interfaces';
import { getComponent } from '../../utils/library';
import renderModules, { retrieveModule } from './renderModules';

const Transition = require('react-motion-ui-pack').default;

interface IHierarchy {
  site: ISite;
  department: IDepartment;
  machine: IMachine;
}

export interface IMachineProps {
  departmentDataStore: Map<number, any>;
  hierarchy: IHierarchy;
  activeModuleLabel: string;
}

export interface IMachineState {
  activeModule: IModule;
  url: string;
  moduleExists: boolean;
}

export class Machine extends React.Component<IMachineProps, IMachineState> {

  constructor(props: IMachineProps) {
    super(props);
    const machine = props.hierarchy.machine;
    this.state = {
      activeModule: props.activeModuleLabel ? retrieveModule(machine, props.activeModuleLabel) : machine.defaultModule,
      url: `/${window.location.pathname}/${machine.name.toLowerCase()}`,
      moduleExists: false,
    };
    this.setActiveModule = this.setActiveModule.bind(this);
  }

  public componentWillReceiveProps(nextProps: IMachineProps) {
    const nextMachine = nextProps.hierarchy.machine;
    const url = window.location.pathname;
    if (nextMachine.id !== this.props.hierarchy.machine.id) {
      let activeModule = nextMachine.defaultModule;
      if (nextProps.activeModuleLabel) {
        activeModule = retrieveModule(nextMachine, nextProps.activeModuleLabel);
      }
      this.setState({ url, activeModule });
    } else {
      this.setState({ url });
    }
  }

  public setActiveModule(activeModule: IModule) {
    this.setState({ activeModule });
  }

  public renderActiveModule() {
    const { departmentDataStore, hierarchy } = this.props;
    const { activeModule } = this.state;
    const componentProps = {
      key: hierarchy.machine.id,
      departmentId: hierarchy.department.id,
      type: 'machine',
      parent: hierarchy.machine,
      module: activeModule,
      departmentDataStore,
    };
    if (process.env.TEST) {
      return getComponent(activeModule.name, componentProps, '__test__');
    }
    return getComponent(activeModule.name, componentProps);
  }

  public generateSpring = (value: number) => spring(value, { stiffness: 70, damping: 40 });

  public render() {
    const { activeModule } = this.state;
    const { hierarchy } = this.props;
    const description = activeModule ? activeModule.description : undefined;
    return (
      <div className="display__container">
        <div className="display__module-container">
          {renderModules(activeModule, hierarchy.machine, this.setActiveModule)}
        </div>
        <Transition
          key={activeModule ? activeModule.id : 1}
          component={'div'} // don't use a wrapping component
          enter={{ opacity: this.generateSpring(1), scale: 1 }}
          leave={{ opacity: this.generateSpring(0), scale: 0.99 }}
        >
          {
          <div key={activeModule ? activeModule.id + 1 : 2} className="display__content-container" >
            <div className="display__component-container" >
              {!activeModule ? <h3 style={{ textAlign: 'center' }}>No Modules Available</h3>
              : this.renderActiveModule()}
            </div>
          </div>}
        </Transition>
      </div>
    );
  }
}

function mapStateToProps(state: IReduxState, ownProps: IMachineProps) {
  const id = ownProps.hierarchy.department.id;
  return { departmentDataStore: state.departmentStores.get(id) };
}

export default connect<{}, {}, IMachineProps>(mapStateToProps)(Machine);
