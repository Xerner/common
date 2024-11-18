import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { HttpCacheService } from "./http-cache.service";
import { HttpCacheClient } from "./http-cache-client.service";

/**
 * Intercepts HTTP requests and caches the responses.
 * The intention behind creating this service was to cache responses without ever sending
 * the request to the server while developing front-ends for REST API's to avoid API limits.
 *
 * @example
 * ```ts
 * import preloadedCache from './some-json-file.json';
 *
 * const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpCacheClient(cacheSettings, preloadedCache),
 *   ]
 * };
 *
 * bootstrapApplication(AppComponent, appConfig)
 *   .catch((err) => console.error(err));
 * ```
 */
@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
  /**
   * @param {HttpCacheService} cacheService - The service used to cache HTTP responses.
   */
  constructor(
    private cacheService: HttpCacheService,
  ) { }

  /**
   * Intercepts an outgoing HTTP request, handles it, and caches the response.
   * If the response is already cached, it is returned immediately.
   * @param {HttpRequest<any>} req - The outgoing HTTP request.
   * @param {HttpHandler} handler - The next handler in the chain.
   * @returns {Observable<HttpEvent<unknown>>} - An observable of the HTTP event.
   */
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<unknown>> {
    var cached = this.cacheService.find(req);
    if (cached) {
      if (this.cacheService.settings.verbose) {
        console.log("Returning cached response for", req.method, req.url, req.params);
      }
      return of(cached.response);
    }
    return handler.handle(req).pipe(tap(event => this.cacheService.insert(req, event)));
  }
}
