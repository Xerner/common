import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpCacheStore } from "./http-cache.store";

/** Also see {@link HttpCacheClient} */
@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
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
      console.log("Caching results for", req.url);
      this.cacheStore.urlCache[req.url] = event;
    }
  }
}
