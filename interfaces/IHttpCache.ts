import { HttpResponse } from "@angular/common/http";

export type IHttpCache = Record<string, HttpResponse<any>>;
