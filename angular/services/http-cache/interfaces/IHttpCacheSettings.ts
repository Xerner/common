export interface IHttpCacheSettings {
  /**
   * If true, the {@link HttpCachingInterceptor} will be injected to cache responses.
   *
   * @default true
   */
  enableInterceptor?: boolean;
  /**
   * If true, logs all cache hits and misses to the console.
   *
   * @default false
   */
  verbose?: boolean;
}
