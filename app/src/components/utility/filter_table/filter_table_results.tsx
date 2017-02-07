import * as React from 'react';

export interface IResultsProps {
  ratio: string;
  percent: string;
}

const Results = ({ ratio, percent }: IResultsProps) => (
  <div className="filter_table__results-container">
    {`Displaying ${ratio} rows - ${percent}%`}
  </div>
);

export default Results;
