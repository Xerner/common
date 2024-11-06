import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs';
import { LOADING_SERVICE_TOKEN } from './token';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    var loadingService = inject(LOADING_SERVICE_TOKEN);
    var loadingItem = { source: req.url, input: req }
    loadingService.startLoading(loadingItem);
    return next.handle(req)
      .pipe(tap(event => {
        loadingService.stopLoading(loadingItem);
        return event;
      }));
  }
}