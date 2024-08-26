export type QueryParamKeys<T> = {
  [key in keyof T]: string;
};
export type UntypedQueryParamKeys = QueryParamKeys<any>;
