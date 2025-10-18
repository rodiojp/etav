// C:\temp\temp-ang\etav\src\app\_v6\services\shared\dialog-config-factory.ts
import { Type } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogComponentData, DialogConfiguration } from './dialog-manager.service';

/**
 * A reusable builder for creating DialogOptions objects.
 * Simplifies constructing consistent dialog configurations.
 */
export class DialogConfigFactory {
  // Overload 1 — component only (no input or result)
  static createConfig<TComponent>(
    id: string,
    component: Type<TComponent>,
    input: null,
    configOverrides?: Partial<MatDialogConfig<DialogComponentData<null, void>>>
  ): DialogConfiguration<TComponent, null, void>;

  // Overload 2 — component + input data
  static createConfig<TComponent, TData>(
    id: string,
    component: Type<TComponent>,
    input: TData,
    configOverrides?: Partial<MatDialogConfig<DialogComponentData<TData, void>>>
  ): DialogConfiguration<TComponent, TData, void>;

  // Overload 3 — component + input data + result
  static createConfig<TComponent, TData, TResult>(
    id: string,
    component: Type<TComponent>,
    input: TData | null,
    configOverrides?: Partial<
      MatDialogConfig<DialogComponentData<TData, TResult>>
    >
  ): DialogConfiguration<TComponent, TData, TResult>;

  // Implementation
  static createConfig<TComponent, TData = null, TResult = void>(
    id: string,
    component: Type<TComponent>,
    input: TData | null,
    configOverrides: Partial<
      MatDialogConfig<DialogComponentData<TData, TResult>>
    > = {}
  ): DialogConfiguration<TComponent, TData, TResult> {
    const data: DialogComponentData<TData, TResult> = {
      input,
      output: null,
    };

    const config: MatDialogConfig<DialogComponentData<TData, TResult>> = {
      ...configOverrides,
      data,
    };

    return {
      id,
      component,
      config,
    };
  }
}
