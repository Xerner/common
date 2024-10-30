import { Feature } from "../types/Feature";
import { View } from "../types/View";

/**
 * A view is a collection of features that are related to one another
 */
export interface IFeatureView<TView extends View, TFeature extends Feature> {
  view: TView;
  features: TFeature[];
}
