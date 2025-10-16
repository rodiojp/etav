import { Type } from '@angular/core';
import { DialogComponentData, DialogOptions } from './dialog-manager.service';

/**
 * A reusable builder for dialog configurations.
 * Simplifies creating consistent MatDialog configs.
 */
export class DialogConfigFactory {
  static createConfig<TData, TResult, TComponent>(
    id: string,
    component: Type<TComponent>,
    input: TData | null,
    options?: Partial<DialogOptions<DialogComponentData<TData, TResult>>>
  ): DialogOptions<DialogComponentData<TData, TResult>> {
    const data: DialogComponentData<TData, TResult> = {
      input,
      output: null,
    };

    return {
      id,
      component,
      data,
      width: options?.width ?? '480px',
      height: options?.height ?? null,
      panelClass: options?.panelClass ?? null,
    };
  }
}
