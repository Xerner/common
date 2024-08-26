import { InjectionToken, makeEnvironmentProviders, Provider } from "@angular/core";
import { QueryParamKeys } from "./query-param-keys";
import { QueryParamsStore } from "./query-params.store";
import { provideRouter } from '@angular/router';

export const QUERY_PARAM_KEYS = new InjectionToken<QueryParamKeys>("QUERY_PARAM_KEYS");

/**
 * Co-requisite provider: {@link provideRouter}
 * 
 * Sets up providers necessary to have helper classes decode query parameters.  
 * @param queryParamKeys An object whos keys map to expected query parameter names
 */
export function provideQueryParams(queryParamKeys: QueryParamKeys) {
  const providers: Provider[] = [
    { provide: QUERY_PARAM_KEYS, useValue: queryParamKeys },
    QueryParamsStore
  ]

  return makeEnvironmentProviders(providers);
}
