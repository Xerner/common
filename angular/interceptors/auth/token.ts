import { InjectionToken } from "@angular/core";
import { ITokenService } from "./ITokenService";

export const TOKEN_SERVICE = new InjectionToken<ITokenService>("BEARER_TOKEN_SERVICE_TOKEN");
