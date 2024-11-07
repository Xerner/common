import { computed, Injectable, Signal, signal } from '@angular/core';
import { ILoadingService } from './ILoadingService';
import { ILoading } from './ILoading';

@Injectable()
export class LoadingService implements ILoadingService {
  readonly isAnyLoading = computed<boolean>(() => this.itemsLoading().length != 0);
  private readonly _itemsLoading = signal<ILoading<any>[]>([]);
  readonly itemsLoading: Signal<ILoading<any>[]> = this._itemsLoading;

  isLoading(source: string): boolean {
    return this.itemsLoading().some(item => item.source === source);
  }

  startLoading<T>(item: ILoading<T>): void {
    this._itemsLoading.set([...this.itemsLoading(), item]);
  }
  stopLoading<T>(item: ILoading<T>): void {
    this._itemsLoading.set(this.itemsLoading().filter(item_ => item_ !== item));
  }
}