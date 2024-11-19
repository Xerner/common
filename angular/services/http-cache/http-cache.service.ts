import { Inject, Injectable } from '@angular/core';
import { IHttpCacheItem } from './interfaces/IHttpCache';
import { IHttpCacheSettings } from './interfaces/IHttpCacheSettings';
import { HTTP_CACHE_SETTINGS, PRELOADED_HTTP_CACHE } from './tokens';
import { HttpEvent, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpCacheService {
  /**
   * The cache storage.
   * @private
   */
  private _cache: IHttpCacheItem<any>[] = [];

  /**
   * Gets the cache as a read-only array.
   */
  get cache(): Readonly<IHttpCacheItem<any>[]> {
    return this._cache;
  }

  /**
   * Creates an instance of HttpCacheService.
   * @param settings The cache settings.
   * @param preloadedCache The preloaded cache items.
   */
  constructor(
    @Inject(HTTP_CACHE_SETTINGS) public settings: IHttpCacheSettings,
    @Inject(PRELOADED_HTTP_CACHE) preloadedCache: IHttpCacheItem<any>[],
  ) {
    this.initialize(preloadedCache);
  }

  /**
   * Initializes the cache with preloaded values.
   * @param cache The preloaded cache items.
   * @private
   */
  private initialize(cache: IHttpCacheItem<any>[]) {
    console.log("Initializing cache with values", cache);
    this._cache = cache;
  }

  /**
   * Finds a cache item by request or method, URL, and params.
   * @param method The HTTP request or method.
   * @param url The URL (optional if method is a request).
   * @param params The HTTP params (optional).
   * @returns The cache item or null if not found.
   */
  find<T>(request: HttpRequest<T>): IHttpCacheItem<T> | null
  find<T>(method: string, url: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): IHttpCacheItem<T> | null
  find<T>(method: HttpRequest<T> | string, url?: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): IHttpCacheItem<T> | null {
    var request = typeof method === "string" ? null : method;
    method = request === null ? method : request.method;
    url = request === null ? url : request.url;
    params = request === null ? params : request.params;
    if (url === undefined) {
      return null;
    }
    if (this.settings.verbose) {
      console.log("Checking cache for", method, url, params);
    }
    var item = this.cache.find((item) => {
      if (item.request.method !== method || item.request.url !== url) {
        return false;
      }
      return this.paramsAreEqual(params, item.request.params);
    })
    return item ?? null;
  }

  /**
   * Checks if a cache item exists by request or method, URL, and params.
   * @param method The HTTP request or method.
   * @param url The URL (optional if method is a request).
   * @param params The HTTP params (optional).
   * @returns True if the cache item exists, false otherwise.
   */
  has<T>(request: HttpRequest<T>): boolean;
  has(method: string, url: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): boolean;
  has<T>(method: HttpRequest<T> | string, url?: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): boolean {
    if (typeof method === "string") {
      if (url === undefined) {
        return false;
      }
      return this.find(method, url, params) !== null;
    }
    return this.find(method) !== null;
  }

  /**
   * Inserts a response into the cache.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  insert<T>(request: HttpRequest<T>, response: HttpEvent<T>) {
    if (response.type !== HttpEventType.Response) {
      return;
    }
    if (this.settings.verbose) {
      console.log("Caching results for", request.method, request.url, request.params);
    }
    this._cache.push(this.createHttpCacheItem(request, response))
  }

  /**
   * Creates a cache item from a request and response.
   * @param request The HTTP request.
   * @param response The HTTP response.
   * @returns The cache item.
   * @private
   */
  private createHttpCacheItem<T>(request: HttpRequest<T>, response: HttpResponse<T>): IHttpCacheItem<T> {
    return {
      request: request,
      response: response,
    }
  }

  /**
   * Checks if the params are defined and have keys.
   * @param params The HTTP params.
   * @returns True if params are defined and have keys, false otherwise.
   */
  hasParams(params?: HttpParams): boolean {
    return params === undefined || params.keys().length > 0;
  }

  /**
   * Compares two sets of HTTP params for equality.
   * @param params1 The first set of params.
   * @param params2 The second set of params.
   * @returns True if the params are equal, false otherwise.
   */
  paramsAreEqual(params1?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }, params2?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): boolean {
    if (params1 === undefined && params2 === undefined) {
      return true;
    }
    if (params1 === undefined || params2 === undefined) {
      return false;
    }
    var keys1 = this.getAllKeys(params1).sort();
    var keys2 = this.getAllKeys(params2).sort();
    if (keys1.length !== keys2.length) {
      return false;
    }
    var areKeysAndValuesEqual = keys1.every((key1, index) => {
      var key2 = keys2[index];
      var keysAreEqual = key1 === key2;
      var values1 = this.getAllValues(key1, params1)?.sort();
      var values2 = this.getAllValues(key2, params2)?.sort();
      if (values1 === undefined && values2 === undefined) {
        return true;
      }
      if (values1 === undefined || values2 === undefined) {
        return false;
      }
      if (values1.length !== values2.length) {
        return false;
      }
      var allValuesAreEqual = values1!.every((value1, index) => value1 === values2![index]);
      return keysAreEqual && allValuesAreEqual;
    });
    return areKeysAndValuesEqual;
  }

  /**
   * Clears the cache or removes a specific cache item.
   * @param method The HTTP request or method (optional).
   * @param url The URL (optional if method is a request).
   * @param params The HTTP params (optional).
   */
  bust(): void
  bust<T>(request: HttpRequest<T>): void;
  bust(method: string, url: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): void;
  bust<T>(method?: HttpRequest<T> | string, url?: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): void {
    if (method === undefined) {
      this._cache = [];
      return;
    }
    if (typeof method === "string") {
      var item = this.find(method, url!, params);
      if (item === null) {
        return;
      }
      this._cache = this.cache.filter((cacheItem) => cacheItem !== item);
      return;
    }
    item = this.find(method);
    if (item === null) {
      return;
    }
    this._cache = this.cache.filter((cacheItem) => cacheItem !== item);
  }

  private getAllKeys(params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): string[] {
    if (params === undefined) {
      return [];
    }
    if (params instanceof HttpParams) {
      return params.keys();
    }
    return Object.keys(params);
  }

  private getAllValues(key: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; }): string[] | null {
    if (params === undefined) {
      return [];
    }
    if (params instanceof HttpParams) {
      return params.getAll(key);
    }
    return Array.isArray(params[key]) ? params[key] : [params[key]];
  }
}
