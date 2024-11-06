import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { makeEnvironmentProviders, Provider } from "@angular/core";
import { ILoadingService } from "./ILoadingService";
import { LoadingInterceptor } from "./loading.interceptor";
import { LOADING_SERVICE_TOKEN } from "./token";

export function provideLoadTracking<T extends ILoadingService>(tokenProvider: new (...args: any[]) => T) {
  const providers: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: LOADING_SERVICE_TOKEN, useClass: tokenProvider },
  ]

  return makeEnvironmentProviders(providers);
}
