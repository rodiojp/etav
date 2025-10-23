import { ComponentType } from '@angular/cdk/portal';
import { MatDialogRef } from "@angular/material/dialog";
import { DialogType } from "./dialog-type";

/**
 * Tracked open dialog instance
 */
export interface TrackedDialog {
  id: string;
  matDialogRef: MatDialogRef<any, any>;
  component: ComponentType<any>;
  dialogType: DialogType;
  priority: number;
  openedAt: Date;
}