import AllIcon from 'material-ui/svg-icons/communication/clear-all';
import AnyIcon from 'material-ui/svg-icons/content/filter-list';
import * as React from 'react';

export interface IFilterToggleProps {
  handleToggleMode: () => void;
  filterAny: boolean;
}

const FilterToggle = ({ handleToggleMode, filterAny }: IFilterToggleProps): JSX.Element => (
  <div className="filter_table__mode-container" onClick={this.handleToggleMode} >
    {this.state.filterAny ? <AllIcon /> : <AnyIcon />}
    <div className="tooltip__text">Toggle Filter Mode</div>
  </div>
);

export default FilterToggle;
