import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { HttpCacheStore } from "./http-cache.store";
import { HttpClient, HTTP_INTERCEPTORS, HttpHandler, ɵHttpInterceptorHandler } from "@angular/common/http";
import { HttpCacheClient } from "./http-cache-client.service";
import { HTTP_CACHE_SETTINGS } from "./settings-token";
import { IHttpCacheSettings } from "./interfaces/IHttpCacheSettings";
import { HttpCachingInterceptor } from "./caching.interceptor";

/**
 * Configures {@link HttpCacheClient} to be available for injection instead of 
 * Angulars usual {@link HttpClient}
 * 
 * If `onlyUseCache = true` then `enableClient` is automatically set to `true` regardless of its configured value
 */
export function provideHttpCacheClient(cacheSettings: IHttpCacheSettings): EnvironmentProviders {
  const providers: Provider[] = [
    { provide: HTTP_CACHE_SETTINGS, useValue: cacheSettings },
    HttpCacheStore,
  ]
  if (cacheSettings.onlyUseCache === true) {
    cacheSettings.enableClient = true;
  }
  if (cacheSettings.enableClient) {
    providers.push({ provide: HttpHandler, useClass: ɵHttpInterceptorHandler })
    providers.push({ provide: HttpClient, useClass: HttpCacheClient })
  }
  if (cacheSettings.enableInterceptor) {
    providers.push({ provide: HTTP_INTERCEPTORS, useClass: HttpCachingInterceptor, multi: true })
  }
  return makeEnvironmentProviders(providers);
}
