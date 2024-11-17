import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormControl, FormControlOptions, FormControlState, ValidatorFn } from "@angular/forms";

export class FormControlExt<T> extends FormControl<T | null> {
  private _control;

  override setValue(value: T, options?: Object): void {
    this._control.setValue(value, options)
  }
  override patchValue(value: T, options?: Object): void {
    this._control.patchValue(value, options)
  }
  override reset(value?: T | undefined, options?: Object): void {
    this._control.reset(value, options)
  }

  constructor(
    // formState and defaultValue will only be null if T is nullable
    formState: FormControlState<T> | T = null as unknown as T,
    options: FormControlOptions & { nonNullable: true } = { nonNullable: true },
  ) {
    super(formState, options);
    this._control = new FormControl(formState, options);
  }
}

export interface IFormControlExtOptions extends AbstractControlOptions {
  queryParamKey?: string;

}
