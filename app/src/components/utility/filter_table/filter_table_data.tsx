import * as React from 'react';
import * as Infinite from 'react-infinite';

import { IConfig, IDictionary } from '../../../constants/interfaces';
import Row from './filter_table_row';


export interface ITableDataProps {
  finalTableData: Array<IDictionary<string>>;
  handleRowClick?: (row: any, column: number) => void;
  config: IConfig[];
  height?: number;
}

/**
 * Contains filter table rows in an infinite list. The infinite
 * list enormously helps improve render performance, especially
 * for large data sets.
 *
 * See: https://github.com/seatgeek/react-infinite
 *
 * @class TableData
 * @extends {Component}
 */
class TableData extends React.Component<ITableDataProps, {}> {

  /**
   * Return a list of Row components
   *
   * @param {function} handleRowClick - function called with row object when clicked
   * @returns {object} immutable list
   *
   * @memberOf TableData
   */
  public generateRows(handleRowClick: (row: any, column: number) => void): JSX.Element[] {
    const { finalTableData, config } = this.props;
    return finalTableData.map((data, i) => (
      <Row key={i} rowData={data} config={config} handleClick={handleRowClick} />
    ));
  }

  public render(): JSX.Element {
    return (
      <div className="filter_table__row-container">
        <Infinite
          className="filter-table-body"
          containerHeight={this.props.height || window.innerHeight - 300}
          elementHeight={22}
        >
          {this.generateRows(this.props.handleRowClick)}
        </Infinite>
      </div>
    );
  }
}


export default TableData;
