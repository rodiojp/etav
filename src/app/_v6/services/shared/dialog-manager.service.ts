import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

/**
 * Data structure passed to dialog components
 */
export interface DialogComponentData<TData, TResult> {
  input: TData | null;
  output: TResult | null;
}

/**
 * Configuration for opening a dialog
 */
export interface DialogConfiguration<TComponent, TData = any, TResult = any> {
  id: string;
  component: ComponentType<TComponent>;
  config: MatDialogConfig<DialogComponentData<TData, TResult>> | undefined;
}

/**
 * Tracked open dialog instance
 */
interface TrackedDialog {
  id: string;
  matDialogRef: MatDialogRef<any, any>;
  component: ComponentType<any>;
  openedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DialogManagerService {
  private readonly dialogs = new Map<string, TrackedDialog>();
  private readonly matDialog = inject(MatDialog);

  /**
   * Open a dialog and return the id + result promise
   * @param dialog
   * @returns id and result promise
   */
  open<TComponent, TData = any, TResult = any>(
    dialog: DialogConfiguration<TComponent, TData, TResult>
  ): { id: string; result: Promise<TResult | null> } {
    const ref = this.matDialog.open<
      TComponent,
      DialogComponentData<TData, TResult>
    >(dialog.component, dialog.config);

    this.dialogs.set(dialog.id, {
      id: dialog.id,
      matDialogRef: ref,
      component: dialog.component,
      openedAt: new Date(),
    });

    // Cleanup after close
    ref.afterClosed().subscribe(() => {
      this.dialogs.delete(dialog.id);
    });

    const result = firstValueFrom(ref.afterClosed()).then((res) => res ?? null);

    return { id: dialog.id, result };
  }

  /**
   * Close a specific dialog by id
   * @param id ID of the dialog to close
   * @param result Optional result to pass back to the caller
   */
  close(id: string, result?: any): void {
    const tracked = this.dialogs.get(id);
    if (tracked) {
      tracked.matDialogRef.close(result);
      this.dialogs.delete(id);
    }
  }

  /**
   * Close all open dialogs
   */
  closeAll(): void {
    this.dialogs.forEach((tracked) => tracked.matDialogRef.close());
    this.dialogs.clear();
  }

  /**
   * Get currently open dialogs
   */
  getOpenDialogs(): TrackedDialog[] {
    return Array.from(this.dialogs.values());
  }

  /**
   * Check if a specific component is open
   * @param component Component to check
   * @returns boolean indicating if the component is open
   */
  isOpen(component: any): boolean {
    return Array.from(this.dialogs.values()).some(
      (d) => d.component === component
    );
  }
}
