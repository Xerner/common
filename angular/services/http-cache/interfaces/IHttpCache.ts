import { HttpRequest, HttpResponse } from "@angular/common/http";

export interface IHttpCacheItem<T = any> {
  request: HttpRequest<T>;
  response: HttpResponse<T>;
}
