export interface IHttpCacheSettings {
  /**
   * If true, the {@link HttpCacheClient} will be injected to cache responses.
   *
   * @default true
   */
  enableClient?: boolean;
  /**
   * If true, the {@link HttpCachingInterceptor} will be injected to cache responses.
   *
   * @default true
   */
  enableInterceptor?: boolean;
  /**
   * If true, prevents all requests from being sent and only returns responses that exist in the cache.
  *
  * @default false
  */
 onlyUseCache?: boolean;
 /**
  * If true, logs all cache hits and misses to the console.
  *
  * @default false
  */
  verbose?: boolean;
  /**
   * WIP. The source of the cache. If set to "file", the cache is expcted to be loaded from a file.
   */
  cacheSource?: "file";
}
