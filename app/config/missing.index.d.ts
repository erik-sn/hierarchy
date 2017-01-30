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