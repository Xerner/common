import { HttpResponse } from "@angular/common/http";

/**
 * Example
 * 
 * ```ts
 * {
 *  "https://www.example.com": {
 *     body: "hello world"
 *   }
 * }
 * ```
 */
export type IHttpCache = Record<string, HttpResponse<any>>;
