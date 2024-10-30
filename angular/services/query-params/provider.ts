import { InjectionToken, makeEnvironmentProviders, Provider } from "@angular/core";
import { UntypedQueryParamKeys } from "./query-param-keys";
import { QueryParamsStore } from "./query-params.store";
import { provideRouter } from '@angular/router';

export const QUERY_PARAM_KEYS = new InjectionToken<UntypedQueryParamKeys>("QUERY_PARAM_KEYS");

/**
 * TODO: figure out a way to type this so that it forces the generic type to be an enum with string values
 * 
 * ---
 * 
 * {@link provideRouter} must be used in the application configuration for this to work.
 * 
 * ---
 * 
 * Provides 
 * - {@link QueryParamsStore} service to interact with url query parameters as signals.
 * - {@link QUERY_PARAM_KEYS} An enum that maps its keys to the expected query parameter names.
 * @param queryParamKeys An object whos keys map to expected query parameter names
 */
export function provideQueryParams<TQueryParamsEnum>(queryParamKeys: TQueryParamsEnum) {
  const providers: Provider[] = [
    { provide: QUERY_PARAM_KEYS, useValue: queryParamKeys },
    QueryParamsStore
  ]

  return makeEnvironmentProviders(providers);
}
