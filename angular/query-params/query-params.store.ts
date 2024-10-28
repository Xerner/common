import { Inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, QueryParamsHandling, Router, provideRouter } from '@angular/router';
import { map, Observable } from 'rxjs';
import { QUERY_PARAM_KEYS } from './provider';
import { QueryParamKeys } from './query-param-keys';

/**
 * A service that provides an abstraction layer to interact with url query parameters as signals. 
 * To subscribe to query parameter changes like an event listener, use the `queryParamMap` property on {@link Router}.
 * 
 * Requires 
 * - Angulars {@link Router} service to be provided. see {@link provideRouter}
 * - An enum {@link TQueryParamEnum} that maps its keys to the expected query parameter names.
 * 
 * @see {@link provideRouter}
 * @see {@link QueryParamKeys}
 */
@Injectable({
  providedIn: 'root'
})
export class QueryParamsStore<TQueryParamEnum extends string> {
  observables: Partial<Record<TQueryParamEnum, Observable<string[]>>> = {};
  private readonly queryParams: Partial<Record<TQueryParamEnum, WritableSignal<string[]>>> = {};
  /**
   * A map of all query parameters that are being tracked by the store as defined in the {@link TQueryParamEnum} enumerator.
   * Automatically updates when the query parameter changes using {@link Router}
   */
  get params(): Record<TQueryParamEnum, Signal<string[]>> {
    return this.queryParams as Record<TQueryParamEnum, Signal<string[]>>;
  }

  constructor(
    @Inject(QUERY_PARAM_KEYS) public keys: QueryParamKeys<TQueryParamEnum>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createQueryParamSignalsFromEnum();
    this.route.queryParamMap.subscribe(this.subscribeToQueryParamChanges.bind(this));
  }

  /**
   * Creates observables for all query parameters defined in the {@link TQueryParamEnum} enumerator and stores them in the {@link observables} property
   */
  initializeQueryParamObservables() {
    for (const key in this.keys) {
      var typedKey = key as unknown as TQueryParamEnum;
      this.observables[typedKey] = this.getObservable(typedKey);
    }
  }

  /**
   * Creates a shortcut from `this.route.queryParamMap` to the desired query parameter
   */
  private getObservable(name: TQueryParamEnum): Observable<string[]> {
    return this.route.queryParamMap.pipe(map<ParamMap, string[]>(params => params.getAll(name)));
  }

  /**
   * Subscribes to query parameter changes and updates the store accordingly
   */
  private subscribeToQueryParamChanges(params: ParamMap) {
    params.keys.forEach((key) => {
      var keyIsNotAnExpectedQueryParam = Object.values(this.keys).includes(key) == false;
      if (keyIsNotAnExpectedQueryParam) {
        throw new Error(`Query parameter '${key}' is not a value in the provided enum`);
      }
      var paramValues = params.getAll(key);
      var typedKey = key as TQueryParamEnum;
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
   * Creates signals for all query parameters defined in the {@link TQueryParamEnum} enumerator and stores them in the {@link queryParams} property
   */
  private createQueryParamSignalsFromEnum() {
    for (const key in this.keys) {
      var typedKey = key as unknown as TQueryParamEnum;
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
  set<T>(name: TQueryParamEnum, value: T, queryParamsHandling: QueryParamsHandling = 'merge') {
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
