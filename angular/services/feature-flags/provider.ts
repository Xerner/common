import { makeEnvironmentProviders, Provider } from "@angular/core";
import { FEATURE_FLAGS_TOKEN, FEATURE_VIEWS_TOKEN } from "./tokens";
import { FeatureService } from "./feature.service";
import { View } from "./types/View";
import { Feature } from "./types/Feature";
import { IFeatureFlag } from "./interfaces/IFeatureFlag";
import { IFeatureView } from "./interfaces/IFeatureView";

export function provideFeatureFlags<TFeature extends Feature, TView extends View>(features?: IFeatureFlag<TFeature>[], views?: IFeatureView<TView, TFeature>[]) {
  const providers: Provider[] = [
    { provide: FEATURE_FLAGS_TOKEN, useValue: features },
    { provide: FEATURE_VIEWS_TOKEN, useValue: views },
    FeatureService<TFeature, TView>
  ]

  return makeEnvironmentProviders(providers);
}
