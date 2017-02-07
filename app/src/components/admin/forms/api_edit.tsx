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

/**
 * This component represents an interface that allows the user to
 * add or remove existing api calls to a parent component. It is
 * designed to be generic in its implementation so any HierarchyTier
 * could potentially use it.
 *
 * @class ApiEdit
 * @extends {React.Component<IApiEditProps, IApiEditState>}
 */
class ApiEdit extends React.Component<IApiEditProps, IApiEditState> {

  constructor(props: IApiEditProps) {
    super(props);
    this.state = {
      apiCalls: props.department.apiCalls,
    };
  }

  /**
   * set the starting value of the parent's apicalls object as the List
   * of primary keys of every api call
   */
  public componentWillMount() {
    const apiCallIds: number[] = this.props.department.apiCalls.map((call) => call.id);
    this.props.change('apiCalls', apiCallIds);
  }


  /**
   * Add an API call to the list.
   *
   * @param {IApiCall} apiCall - apiCall we are adding
   * @returns {void}
   *
   * @memberOf ApiEdit
   */
  public handleAddApiCall(apiCall: IApiCall): void {
    // filter any api calls with the same id as the one we are adding to avoid duplicates
    const apiCalls = this.state.apiCalls.filter((api) => api.id !== apiCall.id);
    apiCalls.push(apiCall);  // then add the new one
    this.updateForm(apiCalls);
  }

  /**
   * Delete an API call from the list
   *
   * @param {IApiCall} apicall - api call we are deleting
   * @returns {void}
   *
   * @memberOf ApiEdit
   */
  public handleDeleteApiCall(apiCall: IApiCall): void {
    const apiCalls = this.state.apiCalls.filter((call) => call.id !== apiCall.id);
    this.updateForm(apiCalls);
  }

  /**
   * Update the parent's form using the change function that
   * was passed to this component. The change function is a
   * redux-form specific function
   *
   * @param {IApiCall[]} apiCalls - list of api calls to update
   *
   * @memberOf ApiEdit
   */
  public updateForm(apiCalls: IApiCall[]): void {
    // we store as integers for Django API endpoint
    const apiCallIds = apiCalls.map((api) => api.id);
    this.setState({ apiCalls }, () => this.props.change('apiCalls', apiCallIds));
  }


  /**
   * Generate a list of MenuIems that will go into the list of api calls
   * that belong to the parent.
   *
   * @param {IApiCall[]} apiCalls - parent's apiCalls
   * @returns {JSX.Element[]}
   *
   * @memberOf ApiEdit
   */
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

  /**
   * Generate a list of MenuItems that will go into the select field
   * that lists available ApiCalls.
   *
   * @returns {JSX.Element[]}
   *
   * @memberOf ApiEdit
   */
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
