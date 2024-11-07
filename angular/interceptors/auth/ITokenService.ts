export interface ITokenService<T = string> {
  setToken(token: T): void;
  getToken(): T;
}
