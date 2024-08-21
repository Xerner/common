import { InjectionToken } from "@angular/core";

export const HTTP_CACHE_SETTINGS = new InjectionToken<IHttpCacheSettings>("IHttpCacheSettings")

export interface IHttpCacheSettings {
  enabled: boolean;
  enableInterceptor: boolean;
  cacheSource: "file" | "cookies";
}