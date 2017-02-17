import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

import { IDictionary } from '../../constants/interfaces';
import Csv from '../csv_generator';
import Png from '../png_generator';

export interface IChartContainerProps {
  chartData: Array<IDictionary<number>>;
  xAxis: string;
  showDownload: boolean;
  showImage: boolean;
  children?: JSX.Element[];
}

const ChartContainer = ({ chartData, xAxis, showDownload,
  showImage, children }: IChartContainerProps) => {
  const params = [
    { header: 'X-Axis', label: xAxis },
    { header: 'Value', label: 'value' },
  ];
  return (
    <div className="chart__container" >
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
      <div className="chart__button-container">
        {showDownload ?
          <Csv
            customClass="chart__button"
            customStyle={{ marginRight: '10px' }}
            data={chartData}
            fileName="processworkshop_data"
            params={params}
            showTooltip
          />
          : undefined}
        {showImage ?
          <Png
            customClass="chart__button"
            fileName="processworkshop_plot"
            target="recharts-surface"
          />
        : undefined}
      </div>
    </div>
  );
};

export default ChartContainer;

