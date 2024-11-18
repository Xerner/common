import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { HttpCacheStore } from "./http-cache.store";
import { HttpClient, HTTP_INTERCEPTORS, HttpHandler, ɵHttpInterceptorHandler, HttpFeature, HttpFeatureKind } from "@angular/common/http";
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
export function provideHttpCacheClient(cacheSettings: IHttpCacheSettings | null = null, ...features: HttpFeature<HttpFeatureKind>[]): EnvironmentProviders {
  const defaultSettings = provideDefaultHttpCacheSettings();
  const mergedSettings = { ...defaultSettings, ...cacheSettings };
  const providers: Provider[] = [
    { provide: HTTP_CACHE_SETTINGS, useValue: cacheSettings },
    HttpCacheStore,
  ]
  if (mergedSettings.onlyUseCache === true) {
    mergedSettings.enableClient = true;
  }
  if (mergedSettings.enableClient) {
    if (mergedSettings.verbose) {
      console.log("HttpCacheClient enabled")
    }
    providers.push({ provide: HttpClient, useClass: HttpCacheClient })
    providers.push({ provide: HttpHandler, useClass: ɵHttpInterceptorHandler })
  }
  if (mergedSettings.enableInterceptor) {
    if (mergedSettings.verbose) {
      console.log("HttpCachingInterceptor enabled")
    }
    providers.push({ provide: HTTP_INTERCEPTORS, useClass: HttpCachingInterceptor, multi: true })
  }
  for (const feature of features) {
    providers.push(...feature.ɵproviders);
  }
  return makeEnvironmentProviders(providers);
}

/**
 * Provides the default settings for the cache
 */
export function provideDefaultHttpCacheSettings(): IHttpCacheSettings {
  return {
    enableClient: true,
    enableInterceptor: true,
    cacheSource: "file",
    onlyUseCache: false,
    verbose: false,
  }
}
