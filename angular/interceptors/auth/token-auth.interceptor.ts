import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TOKEN_SERVICE } from './token';
import { ITokenService } from './ITokenService';

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor, ITokenService<string> {
  token = '';

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    var bearerTokenService = inject(TOKEN_SERVICE)
    var token = bearerTokenService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
    return next.handle(req);
  }
}
