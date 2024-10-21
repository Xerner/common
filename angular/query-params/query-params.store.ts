import { Inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, QueryParamsHandling, Router, provideRouter } from '@angular/router';
import { map, Observable } from 'rxjs';
import { QUERY_PARAM_KEYS } from './provider';
import { UntypedQueryParamKeys } from './query-param-keys';

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
  observables: Partial<Record<TQueryParamEnum, Observable<string[] | null>>> = {};
  private readonly queryParams: Partial<Record<TQueryParamEnum, WritableSignal<string[] | null>>> = {};
  /**
   * A map of all query parameters that are being tracked by the store as defined in the {@link TQueryParamEnum} enumerator.
   * Automatically updates when the query parameter changes using {@link Router}
   */
  get params(): Partial<Record<TQueryParamEnum, Signal<string[] | null>>> {
    return this.queryParams;
  }

  constructor(
    @Inject(QUERY_PARAM_KEYS) private queryParamKeys: UntypedQueryParamKeys,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe(this.subscribeToQueryParamChanges.bind(this));
  }

  /**
   * Creates observables for all query parameters defined in the {@link TQueryParamEnum} enumerator and stores them in the {@link observables} property
   */
  initializeQueryParamObservables() {
    for (const key in this.queryParamKeys) {
      this.observables[key as TQueryParamEnum] = this.getObservable(key as TQueryParamEnum);
    }
  }

  /**
   * Creates a shortcut from `this.route.queryParamMap` to the desired query parameter
   */
  private getObservable(name: TQueryParamEnum): Observable<string[] | null> {
    return this.route.queryParamMap.pipe(map<ParamMap, string[] | null>(params => params.getAll(name)));
  }

  /**
   * Subscribes to query parameter changes and updates the store accordingly
   */
  private subscribeToQueryParamChanges(params: ParamMap) {
    params.keys.forEach((key) => {
      var keyIsNotInEnum = Object.values(this.queryParamKeys).includes(key);
      if (keyIsNotInEnum) {
        throw new Error(`Query parameter key '${key}' is not defined in the provided enum`);
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
   * Sets the query parameter to the provided value. If the value is null, the query parameter will be removed
   * @param name The query parameter key to update
   * @param value The value to update the query parameter to
   * @param queryParamsHandling The strategy for handling the query parameters
   * @returns 
   */
  set<T>(name: TQueryParamEnum, value: T, queryParamsHandling: QueryParamsHandling = 'merge') {
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
