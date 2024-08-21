export type FeatureFlags<T> = {
  [key in keyof T]: boolean;
};
