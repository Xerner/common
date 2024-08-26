import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, QueryParamsHandling, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { QueryParamKeys } from './query-param-keys';
import { QUERY_PARAM_KEYS } from './provider';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsStore {
  readonly queryParams: Record<keyof QueryParamKeys, Observable<string | null>> = {}

  constructor(
    @Inject(QUERY_PARAM_KEYS) public queryParamKeys: QueryParamKeys,
    private router: Router,
    private route: ActivatedRoute
  ) {
    for (const key in queryParamKeys) {
      this.queryParams[key] = this.createQueryParamObservable(key)
    }
  }

  createQueryParamObservable(name: string): Observable<string | null> {
    return this.route.queryParamMap.pipe(map<ParamMap, string | null>(params => params.get(name)));
  }

  update<T>(queryParamKey: keyof QueryParamKeys, value: T, queryParamsHandling: QueryParamsHandling = 'merge') {
    if (value == null) {
      return;
    }
    var currentValue = this.route.snapshot.queryParamMap.get(queryParamKey);
    const queryParams: Params = { [queryParamKey]: value.toString() };
    if (currentValue == value) {
      return;
    }
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
