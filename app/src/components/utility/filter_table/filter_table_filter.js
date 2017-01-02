import React, { Component, PropTypes } from 'react';
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
    this.handleChange = this.handleChange.bind(this);
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
    this.props.updateFilter(event.target.value);
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
        value={this.props.filter}
        onChange={this.handleChange}
      />
    );
  }
}

Filter.propTypes = {
  filter: PropTypes.string.isRequired,
  filterAny: PropTypes.bool,
  updateFilter: PropTypes.func.isRequired,
};

export default Filter;
