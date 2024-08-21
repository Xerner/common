export interface IHttpCacheSettings {
  enabled: boolean;
  enableInterceptor: boolean;
  cacheSource: "file" | "cookies";
}
