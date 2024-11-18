import { Inject, Injectable } from '@angular/core';
import { IHttpCache } from './interfaces/IHttpCache';
import { IHttpCacheSettings } from './interfaces/IHttpCacheSettings';
import { HTTP_CACHE_SETTINGS } from './settings-token';
import { HttpCacheClient } from './http-cache-client.service';

/** Also see {@link HttpCacheClient} */
@Injectable({ providedIn: 'root' })
export class HttpCacheStore {
  urlCache: IHttpCache = {};

  constructor(
    @Inject(HTTP_CACHE_SETTINGS) private cacheSettings: IHttpCacheSettings,
  ) { }

  loadCache(fileCache: IHttpCache) {
    if (this.cacheSettings.cacheSource === "file") {
      console.log("Using pre-fetched cache from file at", this.cacheSettings.cacheSource, "with values", fileCache);
      this.urlCache = fileCache;
    }
  }
}
