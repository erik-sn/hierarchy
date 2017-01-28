import { List } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Close from 'material-ui/svg-icons/navigation/close';
import * as React from 'react';

import { IApiCall, IDepartment } from '../../../constants/interfaces';

export interface IApiEditProps {
  department: IDepartment;
  change: (key: string, value: any) => void;
  apiCalls: IApiCall[];
}

export interface IApiEditState {
  apiCalls: IApiCall[];
}

class ApiEdit extends React.Component<IApiEditProps, IApiEditState> {

  constructor(props: IApiEditProps) {
    super(props);
    this.state = {
      apiCalls: props.department.apiCalls,
    };
  }

  public componentWillMount() {
    const apiCallIds: number[] = this.props.department.apiCalls.map((call) => call.id);
    this.props.change('apiCalls', apiCallIds);
  }


  public handleAddApiCall(apicall: IApiCall): void {
    if (!apicall) {
      return;
    }
    const apicalls = this.state.apiCalls.filter((api) => api.id !== apicall.id);
    apicalls.push(apicall);
    this.updateForm(apicalls);
  }

  public handleDeleteApiCall(apicall: IApiCall): void {
    if (!apicall) {
      return;
    }
    const apicalls = this.state.apiCalls.filter((api) => api.id !== apicall.id);
    this.updateForm(apicalls);
  }

  public updateForm(apiCalls: IApiCall[]): void {
    const apiCallIds = apiCalls.map((api) => api.id);
    this.setState({ apiCalls }, () => this.props.change('apiCalls', apiCallIds));
  }

  public renderApiCallList(apiCalls: IApiCall[]): JSX.Element[] {
    return apiCalls.map((apiCall, i) => {
      const handleCloseClick = () => this.handleDeleteApiCall(apiCall);
      return (
        <MenuItem
          key={i}
          value={apiCall.key}
          primaryText={apiCall.key}
          rightIcon={<Close onClick={handleCloseClick} />}
        />
      );
    });
  }

  public renderApiCallSelectItems(): JSX.Element[] {
    return this.props.apiCalls.map((apiCall, i) => {
      const handleMenuClick = () => this.handleAddApiCall(apiCall);
      return (
        <MenuItem
          key={i}
          value={apiCall.key}
          primaryText={apiCall.key}
          onClick={handleMenuClick}
        />
      );
    });
  }

  public render() {
    const { apiCalls } = this.state;
    return (
      <div className="admin__apicall-edit">
        <h3>API Calls</h3>
        <List>
          {apiCalls && apiCalls.length === 0 ? <div className="admin__message" >No API Calls</div> : ''}
          {this.renderApiCallList(apiCalls)}
        </List>
        <SelectField
          style={{ width: '100%' }}
          hintText="Add Api Call"
          maxHeight={300}
        >
          {this.props.apiCalls ? this.renderApiCallSelectItems() : undefined}
        </SelectField>
      </div>
    );
  }
}


export default ApiEdit;
