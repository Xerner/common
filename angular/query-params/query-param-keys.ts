export type QueryParamKey = string;
export type QueryParamKeys<T> = {
  [key in keyof T]: QueryParamKey;
};
export type UntypedQueryParamKeys = QueryParamKeys<any>;
