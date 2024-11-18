import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpCacheStore } from "./http-cache.store";
import { HTTP_CACHE_SETTINGS } from "./settings-token";

/** Also see {@link HttpCacheClient} */
@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
  readonly settings = inject(HTTP_CACHE_SETTINGS);
  constructor(
    private cacheStore: HttpCacheStore,
  ) { }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<unknown>> {
    // Cache url results
    return handler.handle(req).pipe(
      tap(event => this.cacheResults(req, event))
    );
  }

  cacheResults(req: HttpRequest<any>, event: HttpEvent<unknown>) {
    if (event.type === HttpEventType.Response) {
      if (this.settings.verbose) {
        console.log("Caching results for", req.url);
      }
      this.cacheStore.urlCache[req.url] = event;
    }
  }
}
