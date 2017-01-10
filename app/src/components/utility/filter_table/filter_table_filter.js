import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import TextField from 'material-ui/TextField';


/**
 *
 *
 * @class Filter
 * @extends {Component}
 */
class Filter extends Component {

  /**
   * Creates an instance of Filter.
   *
   * @param {any} props
   *
   * @memberOf Filter
   */
  constructor(props) {
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
  handleChange(event) {
    const filterValue = event.target.value;
    if (this.updateFilter) {
      this.updateFilter(filterValue);
    }
    this.setState({ filterValue });
  }

  render() {
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

Filter.propTypes = {
  filterAny: PropTypes.bool,
  updateFilter: PropTypes.func.isRequired,
};

export default Filter;
