import { IDictionary } from '../../constants/interfaces';

export interface IChartProps {
  chartData: Array<IDictionary<number>>;
  padding: IPadding;
  xAxis: string;
  domain: number[];
  lines?: any[];
  bars?: any[];
  showImage?: boolean;
  showDownload?: boolean;
}


export interface IPadding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

