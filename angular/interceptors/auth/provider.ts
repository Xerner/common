import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { makeEnvironmentProviders, Provider } from "@angular/core";
import { IBearerTokenProvider } from "./IBearerTokenProvider";
import { BearerTokenAuthInterceptor } from "./bearer-auth.interceptor";
import { BEARER_TOKEN_SERVICE_TOKEN } from "./token";

/**
 * Provides the necessary providers for bearer token authentication.
 * 
 * This function sets up the HTTP interceptor and the token provider service
 * for bearer token authentication in an Angular application.
 * 
 * @template T - The type of the token provider.
 * @param {new (...args: any[]) => T} tokenProvider - The token provider class.
 * @returns {Provider[]} The array of providers to be used in the Angular environment.
 * 
 * @example
 * ```ts
 * // In your Angular module
 * import { provideBearerTokenAuth } from './path/to/provider';
 * import { MyTokenProvider } from './path/to/my-token-provider';
 * 
 * NgModule({
 *   providers: [
 *     provideBearerTokenAuth(MyTokenProvider)
 *   ]
 * })
 * export class AppModule {}
 * ```
 * 
 * @example
 * ```ts
 * // In main.ts
 * import { provideBearerTokenAuth } from './path/to/provider';
 * import { MyTokenProvider } from './path/to/my-token-provider';
 * 
 * bootstrapApplication(AppComponent, { providers: provideBearerTokenAuth(MyTokenProvider) })
 *   .catch((err) => console.error(err));
 * ```
 */
export function provideBearerTokenAuth<T extends IBearerTokenProvider>(tokenProvider: new (...args: any[]) => T) {
  const providers: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenAuthInterceptor, multi: true },
    { provide: BEARER_TOKEN_SERVICE_TOKEN, useClass: tokenProvider },
  ]

  return makeEnvironmentProviders(providers);
}
