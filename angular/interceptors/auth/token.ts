import { InjectionToken } from "@angular/core";
import { IBearerTokenProvider } from "./IBearerTokenProvider";

export const BEARER_TOKEN_SERVICE_TOKEN = new InjectionToken<IBearerTokenProvider>("BEARER_TOKEN_SERVICE_TOKEN");
