import { InjectionToken } from "@angular/core";
import { IFeatureView } from "./interfaces/IFeatureView";
import { IFeatureFlag } from "./interfaces/IFeatureFlag";

export const FEATURE_FLAGS_TOKEN = new InjectionToken<IFeatureFlag<string>[]>("FEATURE_FLAGS_TOKEN");
export const FEATURE_VIEWS_TOKEN = new InjectionToken<IFeatureView<string, string>[]>("FEATURE_VIEWS_TOKEN");
