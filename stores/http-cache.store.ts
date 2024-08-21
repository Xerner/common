import { Inject, Injectable } from '@angular/core';
import { HTTP_CACHE_SETTINGS, IHttpCacheSettings } from '../interfaces/IHttpCacheSettings';
import { IHttpCache } from '../interfaces/IHttpCache';

/** Also see {@link HttpCacheClient} */
@Injectable({ providedIn: 'root' })
export class HttpCacheStore {
  urlCache: IHttpCache = {};

  constructor(
    @Inject(HTTP_CACHE_SETTINGS) private cacheSettings: IHttpCacheSettings,
  ) { }

  loadCache(fileCache: IHttpCache) {
    if (this.cacheSettings.cacheSource === "file") {
      console.log("Using cache from ", this.cacheSettings.cacheSource, fileCache);
      this.urlCache = fileCache;
    }
  }

  openCache() {
    console.log(this.urlCache);
    // var json = JSON.stringify(this.urlCache, null, 2);
    // var newTab = window.open('data:text/json,' + encodeURIComponent(json), '_blank');
    // if (newTab === null) {
    //   window.alert("Failed to open new tab. Please allow popups for this site.");
    //   console.log("Failed to open new tab. Please allow popups for this site.");
    //   return;
    // }
    // newTab.focus();
  }
}
