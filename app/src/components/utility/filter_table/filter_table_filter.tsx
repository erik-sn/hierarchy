import { debounce } from 'lodash';
import TextField from 'material-ui/TextField';
import * as React from 'react';

export interface IFilterProps {
  filterAny: boolean;
  updateFilter: (filterValue: string) => void;
}

export interface IFilterState {
  filterValue: string;
}

/**
 * @class Filter
 * @extends {Component}
 */
class Filter extends React.Component<IFilterProps, IFilterState> {

  private updateFilter: (filterValue: string) => void;

  /**
   * Creates an instance of Filter.
   *
   * @param {any} props
   *
   * @memberOf Filter
   */
  constructor(props: IFilterProps) {
    super(props);
    this.state = {
      filterValue: '',
    };
    this.handleChange = this.handleChange.bind(this);
    if (props.updateFilter) {
      this.updateFilter = debounce(props.updateFilter, 150);
    }
  }

  /**
   * Call the parent's updateFilter method when a change
   * event occurs on the text field'
   *
   * @param {object} event
   *
   * @memberOf Filter
   */
  public handleChange(event: React.FormEvent<HTMLInputElement>): void {
    event.preventDefault();
    const filterValue = event.currentTarget.value;
    if (this.updateFilter) {
      this.updateFilter(filterValue);
    }
    this.setState({ filterValue });
  }

  public render(): JSX.Element {
    const hintAny = 'matching any filter';
    const hintAll = 'matching all filters';
    const hintText = this.props.filterAny ? hintAny : hintAll;
    return (
      <TextField
        id="filter_table__filter-field"
        style={{ width: '100%' }}
        hintStyle={{ color: '#999', fontStyle: 'italic' }}
        hintText={`Enter comma separated filters - ${hintText}`}
        value={this.state.filterValue}
        onChange={this.handleChange}
      />
    );
  }
}

export default Filter;
