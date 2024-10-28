import { Inject, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { IFeatureFlag } from "./interfaces/IFeatureFlag";
import { Feature } from "./types/Feature";
import { FEATURE_FLAGS_TOKEN, FEATURE_VIEWS_TOKEN } from "./tokens";
import { IFeatureView } from "./interfaces/IFeatureView";
import { View } from "./types/View";
import { IFeatureFlagSignal, IWritableFeatureFlagSignal } from "./interfaces/IFeatureFlagSignal";

/**
 * Provides helper functions for features and views. Preferabbly TFeature and TView are be enums.
 */
@Injectable()
export class FeatureService<TFeature extends Feature, TView extends View> {
  protected featureFlags: IFeatureFlag<TFeature>[] = [];
  protected featureSignals: IWritableFeatureFlagSignal<TFeature>[] = [];
  protected featureSignalsMap = new Map<TFeature, IWritableFeatureFlagSignal<TFeature>>();
  
  get features(): Map<TFeature, IWritableFeatureFlagSignal<TFeature>> {
    return this.featureSignals;
  }

  constructor(
    @Inject(FEATURE_FLAGS_TOKEN) featureFlags: IFeatureFlag<TFeature>[],
    @Inject(FEATURE_VIEWS_TOKEN) public views: IFeatureView<TView, TFeature>[],
  ) {
    this.updateFeatureFlags(featureFlags);
  }

  /**
   * Updates the available feature flags and their corresponding signals
   * 
   * @param featureFlags The new set of feature flags to use
   */
  updateFeatureFlags(featureFlags: IFeatureFlag<TFeature>[]) {
    featureFlags.forEach((featureFlag) => {
      var featureSignal = this.featureSignals.get(featureFlag.feature);
      if (featureSignal == undefined) {
        featureSignal = this.createWritableFeatureSignal(featureFlag);
        this.featureSignals.set(featureFlag.feature, featureSignal);
        return;
      }
      featureSignal.enabled.set(featureFlag.enabled);
      featureSignal.reason.set(featureFlag.reason ?? null);
    });
    this.featureFlags = featureFlags;
  }

  /**
   * Checks if a feature exists and is enabled
   */
  hasFeature(feature: TFeature, view?: TView) {
    if (this.features == null) {
      return false;
    }
    var viewHasFeature = true;
    if (view != null) {
      viewHasFeature = this.isFeatureInView(feature, view);
    }
    return viewHasFeature && this.featureSignals.some(featureSignal => featureSignal.feature == feature && featureSignal.enabled());
  }

  /**
   * Checks if a feature exists in a view
   */
  isFeatureInView(feature: TFeature, view: TView) {
    if (this.features == null) {
      return false;
    }
    return this.views.some(view_ => view_.view == view && view_.features.includes(feature));
  }

  /**
   * Checks if any of the features are in a view
   */
  someFeatureIsInView(features: TFeature[], view: TView) {
    return features.some(feature => this.isFeatureInView(feature, view));
  }

  private createWritableFeatureSignal(featureFlag: IFeatureFlag<TFeature>) {
    return {
      feature: featureFlag.feature,
      enabled: signal<boolean>(featureFlag.enabled),
      reason: signal<string | null>(featureFlag.reason ?? null),
    };
  }
}
