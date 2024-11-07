import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { BEARER_TOKEN_SERVICE_TOKEN } from './token';

@Injectable()
export class BearerTokenAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    var bearerTokenService = inject(BEARER_TOKEN_SERVICE_TOKEN)
    var token = bearerTokenService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
    return next.handle(req);
  }
}
