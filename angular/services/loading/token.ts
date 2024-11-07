import { InjectionToken } from "@angular/core";
import { ILoadingService } from "../../services/loading/ILoadingService";

export const LOADING_SERVICE_TOKEN = new InjectionToken<ILoadingService>("LOADING_SERVICE_TOKEN");
