import { ComponentType } from '@angular/cdk/portal';
import { DialogType } from "./dialog-type";
import { DialogComponentData } from './dialog-component-data';
import { MatDialogConfig } from '@angular/material/dialog';

/**
 * Configuration for opening a dialog
 */
export interface DialogConfiguration<TComponent, TData = any, TResult = any> {
  id: string;
  dialogType: DialogType;
  priority: number;
  component: ComponentType<TComponent>;
  config: MatDialogConfig<DialogComponentData<TData, TResult>> | undefined;
}