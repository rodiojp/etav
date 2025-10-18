import { Type } from '@angular/core';
import { DialogComponentData, DialogOptions } from './dialog-manager.service';

/**
 * A reusable builder for dialog configurations.
 * Simplifies creating consistent MatDialog configs.
 */
export class DialogConfigFactory {
  // Overload 1 — component only
  static createConfig<TComponent>(
    id: string,
    component: Type<TComponent>,
    input: null,
    options?: Partial<DialogOptions<DialogComponentData<null, void>>>
  ): DialogOptions<DialogComponentData<null, void>>;

  // Overload 2 — component + data
  static createConfig<TComponent, TData>(
    id: string,
    component: Type<TComponent>,
    input: TData,
    options?: Partial<DialogOptions<DialogComponentData<TData, void>>>
  ): DialogOptions<DialogComponentData<TData, void>>;

  // Overload 3 — component + data + result
  static createConfig<TComponent, TData, TResult>(
    id: string,
    component: Type<TComponent>,
    input: TData | null,
    options?: Partial<DialogOptions<DialogComponentData<TData, TResult>>>
  ): DialogOptions<DialogComponentData<TData, TResult>>;

  // Implementation
  static createConfig<TComponent, TData = null, TResult = void>(
    id: string,
    component: Type<TComponent>,
    input: TData | null,
    options: Partial<DialogOptions<DialogComponentData<TData, TResult>>> = {}
  ): DialogOptions<DialogComponentData<TData, TResult>> {
    const data: DialogComponentData<TData, TResult> = {
      input,
      output: null,
    };

    return {
      ...options,
      id,
      component,
      data,
      width: options.width ?? '480px',
      height: options.height ?? null,
      panelClass: options.panelClass ?? null,
    };
  }
}
