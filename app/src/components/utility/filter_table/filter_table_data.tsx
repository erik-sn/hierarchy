import * as React from 'react';
import * as Infinite from 'react-infinite';

import { IConfig, IDictionary } from '../../../constants/interfaces';
import Row from './filter_table_row';

export interface ITableDataProps {
  finalTableData: Array<IDictionary<string>>;
  handleRowClick: () => void;
  config: IConfig[];
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
   * Only update when the row data has changed
   *
   * @param {object} nextProps
   * @returns {boolean}
   *
   * @memberOf TableData
   */
  public shouldComponentUpdate(nextProps: ITableDataProps): boolean {
    const { finalTableData } = this.props;
    return nextProps.finalTableData.length !== finalTableData.length;
  }

  /**
   * Return a list of Row components
   *
   * @param {function} handleRowClick - function called with row object when clicked
   * @returns {object} immutable list
   *
   * @memberOf TableData
   */
  public generateRows(handleRowClick: () => void): JSX.Element[] {
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
          containerHeight={window.innerHeight - 300}
          elementHeight={22}
        >
          {this.generateRows(this.props.handleRowClick)}
        </Infinite>
      </div>
    );
  }
}


export default TableData;
