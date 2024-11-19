import { HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";

export interface IHttpCacheItem<T> {
  request: HttpRequest<T> | SerializedHttpRequest;
  response: HttpResponse<T> | SerializedHttpResponse;
}

export interface SerializedHttpRequest {
  url: string;
  body: string | object | null;
  reportProgress: boolean;
  withCredentials: boolean;
  responseType: string;
  method: string;
  headers: {
    normalizedNames: object;
    lazyUpdate: any;
    headers: object;
    lazyInit: any;
  };
  context: {
    map: object;
  };
  params: HttpParams | RawParams;
  urlWithParams: string;
}

export interface SerializedHttpResponse {
  headers: {
    normalizedNames: object;
    lazyUpdate: any;
  };
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  type: number;
  body: string | object | null;
}

export type RawParams = { [param: string]: RawParamValue; };
export type RawParamValue = string | number | boolean | ReadonlyArray<string | number | boolean> | object | null;
