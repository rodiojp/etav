import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

export interface DialogComponentData<TData, TResult> {
  input: TData | null;
  output: TResult | null;
}

export interface DialogOptions<DialogComponentData> {
  id: string;
  component: any;
  data: DialogComponentData;
  width: string | null;
  height: string | null;
  panelClass: string | string[] | null;
}
interface TrackedDialog {
  id: string;
  ref: MatDialogRef<any, any>;
  component: any;
  openedAt: Date;
}
@Injectable({
  providedIn: 'root',
})
export class DialogManagerService {
  private readonly dialogs = new Map<string, TrackedDialog>();

  private readonly matDialog = inject(MatDialog);

  /** Open dialog and return the id + result promise */
  open<TComponent, TResult = any, TData = any>(
    options: DialogOptions<DialogComponentData<TData, TResult>>
  ): { id: string; result: Promise<TResult | null> } {
    const ref = this.matDialog.open<
      TComponent,
      DialogComponentData<TData, TResult>,
      TResult
    >(options.component, {
      width: options.width ?? '480px',
      height: options.height ?? undefined,
      data: options.data,
      panelClass: options.panelClass ?? undefined,
      disableClose: false,
    });

    this.dialogs.set(options.id, {
      id: options.id,
      ref,
      component: options.component,
      openedAt: new Date(),
    });

    // When closed, remove it from tracking
    ref.afterClosed().subscribe(() => {
      this.dialogs.delete(options.id);
    });
    // Wrap the result to return null if undefined
    const result = firstValueFrom(ref.afterClosed()).then((res) =>
      res === undefined ? null : res
    );
    return { id: options.id, result };
  }

  /** Close by dialog id */
  close(id: string, result?: any): void {
    const tracked = this.dialogs.get(id);
    if (tracked) {
      tracked.ref.close(result);
      this.dialogs.delete(id);
    }
  }

  /** Close all open dialogs */
  closeAll(): void {
    this.dialogs.forEach((tracked) => tracked.ref.close());
    this.dialogs.clear();
  }

  /** Get currently open dialogs */
  getOpenDialogs(): TrackedDialog[] {
    return Array.from(this.dialogs.values());
  }

  /** Check if a specific component is open */
  isOpen(component: any): boolean {
    return Array.from(this.dialogs.values()).some(
      (d) => d.component === component
    );
  }
}
