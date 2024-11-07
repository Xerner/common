import { Signal } from "@angular/core";
import { ILoading } from "./ILoading";

export interface ILoadingService {
  isAnyLoading: Signal<boolean>;
  itemsLoading: Signal<ILoading<any>[]>;

  startLoading(item: ILoading<any>): void;
  stopLoading(item: ILoading<any>): void;
}
