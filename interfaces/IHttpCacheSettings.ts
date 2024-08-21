export interface IHttpCacheSettings {
  caching: {
    enabled: boolean;
    enableInterceptor: boolean;
    cacheSource: "file" | "cookies";
  };
}