
interface Array<T> {
    find(predicate: (search: T) => boolean) : T;
}

interface String {
    includes: any;
}

interface ObjectConstructor {
  assign: any;
}

interface NumberConstructor {
    isNaN: any;
}

declare module 'extract-text-webpack-plugin' {
  const _: any;
  export = _;
}

declare module 'autoprefixer' {
  const _: any;
  export = _;
}

declare module 'react-motion-ui-pack' {
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

declare module 'username' {
  const _: any;
  export = _;
}

declare module 'react-pdfjs' {
  const _: any;
  export = _;
}

// global variable RollBar
declare const Rollbar: any;

// extra definitions for JSX
declare namespace JSX {
  interface IntrinsicElements {
    animate: any;
  }
}

// extra definitions for axios
declare namespace Axios {
  interface AxiosStatic {
    isCancel: any;
  }
}

// extra definitions for material-ui
declare namespace __MaterialUI {
  namespace Card {
    interface CardHeaderProps {
      className?: string;
    }
  }
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