import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { HttpCacheService } from "./http-cache.service";
import { HTTP_INTERCEPTORS, HttpFeature, HttpFeatureKind, provideHttpClient } from "@angular/common/http";
import { HTTP_CACHE_SETTINGS, PRELOADED_HTTP_CACHE } from "./tokens";
import { IHttpCacheSettings } from "./interfaces/IHttpCacheSettings";
import { HttpCachingInterceptor } from "./caching.interceptor";
import { IHttpCacheItem } from "./interfaces/IHttpCache";

/**
 * Provides an HTTP client with caching capabilities.
 *
 * @param {IHttpCacheSettings | null} cacheSettings - Custom cache settings to override the defaults.
 * @param {IHttpCacheItem[] | null} preloadedCache - Preloaded cache items.
 * @param {...HttpFeature<HttpFeatureKind>} features - Additional HTTP features.
 * @returns {EnvironmentProviders} - The environment providers for the HTTP client with cache.
 */
export function provideHttpClientWithCache(cacheSettings: IHttpCacheSettings | null = null, preloadedCache: IHttpCacheItem[] | null = null, ...features: HttpFeature<HttpFeatureKind>[]): EnvironmentProviders {
  const defaultSettings = provideDefaultHttpCacheSettings();
  const mergedSettings = { ...defaultSettings, ...cacheSettings };
  const providers: Provider[] = [
    { provide: HTTP_CACHE_SETTINGS, useValue: cacheSettings },
    HttpCacheService,
  ]
  // interceptor
  if (mergedSettings.enableInterceptor) {
    if (mergedSettings.verbose) {
      console.log("HttpCachingInterceptor enabled")
    }
    providers.push({ provide: HTTP_INTERCEPTORS, useClass: HttpCachingInterceptor, multi: true })
  }
  // preloaded cache
  if (preloadedCache) {
    providers.push({ provide: PRELOADED_HTTP_CACHE, useValue: preloadedCache });
  }
  return makeEnvironmentProviders([provideHttpClient(...features), ...providers]);
}

/**
 * Provides the default settings for the cache.
 *
 * @returns {IHttpCacheSettings} - The default cache settings.
 */
export function provideDefaultHttpCacheSettings(): IHttpCacheSettings {
  return {
    enableInterceptor: true,
    verbose: false,
  }
}
