import { Type } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogComponentData } from '../../models/shared/dialog-component-data';
import { DialogConfiguration } from '../../models/shared/dialog-configuration';
import { DialogType } from '../../models/shared/dialog-type';

/**
 * A reusable builder for creating DialogOptions objects.
 * Simplifies constructing consistent dialog configurations.
 */
export class DialogConfigFactory {
  /**
   * Creates a dialog configuration with the specified component and no input or result.
   * @param id A unique identifier for the dialog.
   * @param dialogType The type of dialog (e.g., MODAL, OVERLAY).
   * @param priority The priority level of the dialog (lower numbers indicate higher priority).
   * @param component The component to be rendered in the dialog.
   * @param input Input data for the dialog component (null if none).
   * @param configOverrides Optional overrides for the dialog configuration.
   * @returns A DialogConfiguration object.
   */
  static createConfig<TComponent>(
    id: string,
    dialogType: DialogType,
    priority: number,
    component: Type<TComponent>,
    input: null,
    configOverrides?: Partial<MatDialogConfig<DialogComponentData<null, void>>>
  ): DialogConfiguration<TComponent, null, void>;

  /**
   * Creates a dialog configuration with the specified component and input data.
   * @param id A unique identifier for the dialog.
   * @param dialogType The type of dialog (e.g., MODAL, OVERLAY).
   * @param priority The priority level of the dialog (lower numbers indicate higher priority).
   * @param component The component to be rendered in the dialog.
   * @param input Input data for the dialog component (null if none).
   * @param configOverrides Optional overrides for the dialog configuration.
   * @returns A DialogConfiguration object.
   */
  static createConfig<TComponent, TData>(
    id: string,
    dialogType: DialogType,
    priority: number,
    component: Type<TComponent>,
    input: TData,
    configOverrides?: Partial<MatDialogConfig<DialogComponentData<TData, void>>>
  ): DialogConfiguration<TComponent, TData, void>;

  /**
   * Creates a dialog configuration with the specified component, input data, and expected result type.
   * @param id A unique identifier for the dialog.
   * @param dialogType The type of dialog (e.g., MODAL, OVERLAY).
   * @param priority The priority level of the dialog (lower numbers indicate higher priority).
   * @param component The component to be rendered in the dialog.
   * @param input Input data for the dialog component (null if none).
   * @param configOverrides Optional overrides for the dialog configuration.
   * @returns A DialogConfiguration object.
   */
  static createConfig<TComponent, TData, TResult>(
    id: string,
    dialogType: DialogType,
    priority: number,
    component: Type<TComponent>,
    input: TData | null,
    configOverrides?: Partial<
      MatDialogConfig<DialogComponentData<TData, TResult>>
    >
  ): DialogConfiguration<TComponent, TData, TResult>;

  /**
   * Creates a dialog configuration with the specified component, input data, and expected result type.
   * @param id A unique identifier for the dialog.
   * @param dialogType The type of dialog (e.g., MODAL, OVERLAY).
   * @param priority The priority level of the dialog (lower numbers indicate higher priority).
   * @param component The component to be rendered in the dialog.
   * @param input Input data for the dialog component (null if none).
   * @param configOverrides Optional overrides for the dialog configuration.
   * @returns A DialogConfiguration object.
   */
  static createConfig<TComponent, TData = null, TResult = void>(
    id: string,
    dialogType: DialogType,
    priority: number,
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

    const finalConfig: DialogConfiguration<TComponent, TData, TResult> = {
      id,
      dialogType,
      priority,
      component,
      config,
    };
    return finalConfig;
  }
}
