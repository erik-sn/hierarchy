import { IDictionary } from '../../constants/interfaces';

export interface IChartProps {
  chartData: Array<IDictionary<any>>;
  padding?: IPadding;
  xAxis?: string;
  domain?: number[];
  lines?: any[];
  bars?: any[];
  showImage?: boolean;
  showDownload?: boolean;
  colors?: string[];
}


export interface IPadding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

