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
export function provideHttpClientWithCache(cacheSettings: IHttpCacheSettings, ...features: HttpFeature<HttpFeatureKind>[]): EnvironmentProviders;
export function provideHttpClientWithCache(cacheSettings: IHttpCacheSettings, preloadedCache?: IHttpCacheItem[], ...features: HttpFeature<HttpFeatureKind>[]): EnvironmentProviders
export function provideHttpClientWithCache(cacheSettings: IHttpCacheSettings, ...args: any[]): EnvironmentProviders {
  const settings = getCacheSettings(cacheSettings);
  const providers: Provider | EnvironmentProviders[] = [
    provideHttpClient(),
    { provide: HTTP_CACHE_SETTINGS, useValue: settings },
    HttpCacheService,
  ]
  addInterceptorIfEnabled(settings, providers);
  if (args.length === 0) {
    return makeEnvironmentProviders(providers);
  }
  // preloaded cache
  const preloadedCache = getPreloadedCache(args);
  providers.push({ provide: PRELOADED_HTTP_CACHE, useValue: preloadedCache });
  return makeEnvironmentProviders(providers);
}

function addInterceptorIfEnabled(settings: IHttpCacheSettings, providers: Provider[]) {
  if (settings.enableInterceptor) {
    if (settings.verbose) {
      console.log("HttpCachingInterceptor enabled")
    }
    providers.push({ provide: HTTP_INTERCEPTORS, useClass: HttpCachingInterceptor, multi: true })
  }
}

function getCacheSettings(cacheSettings: IHttpCacheSettings): IHttpCacheSettings {
  var defaultSettings = provideDefaultHttpCacheSettings();
  return { ...defaultSettings, ...cacheSettings }
}

function getPreloadedCache(args: any[]): IHttpCacheItem[] {
  const preloadedCache = args.length > 0 && Array.isArray(args[0]) ? args[0] :[];
  return preloadedCache || [];
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
