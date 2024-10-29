import { Inject, Injectable, signal } from "@angular/core";
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
  protected featureSignals: { [key in TFeature]: IWritableFeatureFlagSignal<TFeature> } = {} as any;
  protected featureViews: { [key in TView]: IFeatureView<TView, TFeature> } = {} as any;

  /** */
  get features(): { [key in TFeature]: IFeatureFlagSignal<TFeature> } {
    return this.featureSignals;
  }

  get views(): { readonly [key in TView]: IFeatureView<TView, TFeature> } {
    return this.featureViews;
  }

  constructor(
    @Inject(FEATURE_FLAGS_TOKEN) featureFlags: IFeatureFlag<TFeature>[],
    @Inject(FEATURE_VIEWS_TOKEN) views: IFeatureView<TView, TFeature>[],
  ) {
    // Convert the feature flags to signals and store them so they are able to be used to re-render.
    // Only allow updatng the feature flags through the updateFeatureFlags method to ensure the signals are updated.
    this.updateFeatureFlags(featureFlags);
    // Views aren't signals because I'm not sure if they need to be yet
    this.updateViews(views);
  }

  /**
   * Updates the available feature flags and their corresponding signals. 
   * Creates new signals for newly added features. 
   * Updates the existing signals for existing features. 
   * Does not remove signals for removed features.
   * 
   * @param featureFlags The new set of feature flags to use
   */
  updateFeatureFlags(featureFlags: IFeatureFlag<TFeature>[]) {
    featureFlags.forEach((featureFlag) => {
      var featureSignal = this.featureSignals[featureFlag.feature];
      if (featureSignal == undefined) {
        featureSignal = this.createWritableFeatureSignal(featureFlag);
        this.featureSignals[featureFlag.feature] = featureSignal;
        return;
      }
      featureSignal.enabled.set(featureFlag.enabled);
      featureSignal.reason.set(featureFlag.reason ?? null);
    });
    this.featureFlags = featureFlags;
  }

  /**
   * Updates the available views
   */
  updateViews(views: IFeatureView<TView, TFeature>[]) {
    views.forEach((view) => {
      this.featureViews[view.view] = view;
    });
  }

  /**
   * Checks if a feature exists. If a view is provided, it also checks if it exists in the view
   */
  hasFeature(feature: TFeature, view: TView | null = null) {
    if (this.features == null) {
      return false;
    }
    var viewHasFeature = true;
    if (view != null) {
      viewHasFeature = this.isFeatureInView(feature, view);
    }
    var hasFeature = this.featureSignals.hasOwnProperty(feature);
    return hasFeature && viewHasFeature;
  }

  /**
   * Checks if a feature exists and is enabled. If a view is provided, it also checks if it exists in the view
   */
  isFeatureOn(feature: TFeature, view: TView | null = null) {
    if (this.features == null) {
      return false;
    }
    var viewHasFeature = true;
    if (view != null) {
      viewHasFeature = this.isFeatureInView(feature, view);
    }
    var hasFeature = this.hasFeature(feature, view);
    var isFeatureEnabled = hasFeature && this.featureSignals[feature].enabled();
    return hasFeature && viewHasFeature && isFeatureEnabled;
  }

  /**
   * @see {@link isFeatureOn}
   */
  isFeatureOff(feature: TFeature, view: TView | null = null) {
    return this.isFeatureOn(feature, view) == false;
  }

  /**
   * Checks if a feature exists in a view
   */
  isFeatureInView(feature: TFeature, view: TView) {
    if (this.features == null) {
      return false;
    }
    return this.views[view].features.includes(feature);
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
