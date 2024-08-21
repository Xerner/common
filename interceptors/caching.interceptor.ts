import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpCacheClient } from "../services/http-cache-client.service";
import { HttpCacheStore } from "../stores/http-cache.store";
import { IHttpCacheSettings } from "../interfaces/ICacheSettings";

/** Also see {@link HttpCacheClient} */
@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
  constructor(
    private cacheSettings: IHttpCacheSettings,
    private cacheStore: HttpCacheStore,
  ) { }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<unknown>> {
    // passthrough if caching is disabled
    var shouldCacheResponses = this.cacheSettings.caching
      && this.cacheSettings.caching.enableInterceptor
      && !this.cacheSettings.caching.enabled;
    if (shouldCacheResponses) {
      // Cache url results
      return handler.handle(req).pipe(
        tap(event => this.cacheResults(req, event))
      );
    }
    return handler.handle(req);
  }

  cacheResults(req: HttpRequest<any>, event: HttpEvent<unknown>) {
    if (event.type === HttpEventType.Response) {
      console.log("Caching results for", req.url);
      this.cacheStore.urlCache[req.url] = event;
    }
  }
}
