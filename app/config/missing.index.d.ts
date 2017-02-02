interface Array<T> {
    find(predicate: (search: T) => boolean) : T;
}

interface String {
    includes: any;
}

interface NumberConstructor {
    isNaN: any;
}

declare module 'extract-text-webpack-plugin' {
  const _: any;
  export = _;
}

declare module 'react-infinite' {
  const _: any;
  export = _;
}

declare module 'moxios' {
  const _: any;
  export = _;
}


declare module 'recharts' {
	export const BarChart: any
	export const Bar: any
	export const Tooltip: any
	export const Legend: any
	export const Area: any
	export const AreaChart: any
	export const LineChart: any
	export const Line: any
	export const XAxis: any
	export const YAxis: any
	export const CartesianGrid: any
	export const ResponsiveContainer: any
    export const Cell: any;
    export const Pie: any;
    export const PieChart: any;
    export const Sector: any;
}