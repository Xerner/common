export interface IHttpCacheSettings {
  enableClient: boolean;
  enableInterceptor: boolean;
  cacheSource: "file" | "cookies";
  onlyUseCache: boolean;
}
