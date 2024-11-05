import { Inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, QueryParamsHandling, Router, provideRouter } from '@angular/router';
import { map, Observable } from 'rxjs';
import { QUERY_PARAM_KEYS } from './provider';
import { QueryParamKeys } from './query-param-keys';
import { Param } from './types/Param';
import { ParamKeys } from './types/ParamKey';

/**
 * A service that provides an abstraction layer to interact with url query parameters as signals. 
 * To subscribe to query parameter changes like an event listener, use the `queryParamMap` property on {@link Router}.
 * 
 * Requires 
 * - Angulars {@link Router} service to be provided. see {@link provideRouter}
 * - An object {@link TQueryParamKey} that maps its keys to the expected query parameter names. A Typescript enum is recommended for this, but not required.
 * 
 * @see {@link provideRouter}
 * @see {@link QueryParamKeys}
 */
@Injectable()
export class QueryParamsService<TQueryParamKey extends ParamKeys> {
  observables: { [key in keyof TQueryParamKey]: Observable<Param[]> } = {} as any;
  private readonly queryParams: { [key in keyof TQueryParamKey]: WritableSignal<Param[]> } = {} as any;

  /**
   * A map of all query parameters that are being tracked by the store as defined in the {@link TQueryParamKey} enumerator.
   * Automatically updates when the query parameter changes using {@link Router}
   */
  get params(): { [key in keyof TQueryParamKey]: Signal<Param[]>} {
    return this.queryParams;
  }

  constructor(
    @Inject(QUERY_PARAM_KEYS) public readonly keys: { [key in keyof TQueryParamKey]: Signal<Param[]>},
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createQueryParamSignalsFromEnum();
    this.route.queryParamMap.subscribe(this.subscribeToQueryParamChanges.bind(this));
  }

  /**
   * Creates observables for all query parameters defined in the {@link TQueryParamKey} enumerator and stores them in the {@link observables} property
   */
  initializeQueryParamObservables() {
    for (const key in this.keys) {
      var typedKey = key as unknown as keyof TQueryParamKey;
      this.observables[typedKey] = this.getObservable(typedKey);
    }
  }

  /**
   * Creates a shortcut from `this.route.queryParamMap` to the desired query parameter
   */
  private getObservable(name: keyof TQueryParamKey): Observable<Param[]> {
    return this.route.queryParamMap.pipe(map(params => params.getAll(name)));
  }

  /**
   * Subscribes to query parameter changes and updates the store accordingly
   */
  private subscribeToQueryParamChanges(params: ParamMap) {
    params.keys.forEach((key) => {
      var keyIsNotAnExpectedQueryParam = Object.keys(this.keys).includes(key) == false;
      if (keyIsNotAnExpectedQueryParam) {
        throw new Error(`Query parameter '${key}' is not a value in the provided enum`);
      }
      var paramValues = params.getAll(key);
      var typedKey = key as keyof TQueryParamKey;
      if (Object.keys(this.queryParams).includes(typedKey) == false) {
        this.queryParams[typedKey] = signal(paramValues);
        return;
      }
      var paramsSignal = this.queryParams[typedKey];
      if (paramsSignal !== undefined) {
        paramsSignal.set(paramValues);
      }
    })
  }

  /**
   * Creates signals for all query parameters defined in the {@link TQueryParamKey} enumerator and stores them in the {@link queryParams} property
   */
  private createQueryParamSignalsFromEnum() {
    for (const key in this.keys) {
      var typedKey = key as unknown as keyof TQueryParamKey;
      this.queryParams[typedKey] = signal([]);
    }
  }

  /**
   * Sets the query parameter to the provided value. If the value is null, the query parameter will be removed
   * @param name The query parameter key to update
   * @param value The value to update the query parameter to
   * @param queryParamsHandling The strategy for handling the query parameters
   * @returns 
   */
  set<T>(name: keyof TQueryParamKey, value: T, queryParamsHandling: QueryParamsHandling = 'merge') {
    var keyIsNotAnExpectedQueryParam = Object.keys(this.keys).includes(name) == false;
    if (keyIsNotAnExpectedQueryParam) {
      throw new Error(`Query parameter enumerator '${name}' is not a key in the provided enum`);
    }
    if (value === undefined) {
      value = null as T;
    }
    var currentValue = this.route.snapshot.queryParamMap.get(name);
    if (currentValue == value) {
      return;
    }
    const queryParams: Params = { [name]: value === null ? null : value!.toString() };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: queryParamsHandling, // remove to replace all query params by provided
      }
    );
  }
}
