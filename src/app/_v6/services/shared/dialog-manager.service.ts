import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { DialogType } from '../../models/shared/dialog-type';

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
  dialogType: DialogType;
  priority: number;
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
  dialogType: DialogType;
  priority: number;
  openedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DialogManagerService {
  private readonly matDialog = inject(MatDialog);

  /** Separate queues for each dialog type */
  private modalQueue: DialogConfiguration<any>[] = [];
  private overlayQueue: DialogConfiguration<any>[] = [];

  /** Currently active dialogs */
  private activeModal: TrackedDialog | null = null;
  private activeOverlay: TrackedDialog | null = null;

  /**
   * Open a dialog with the given configuration
   * @param dialog The dialog configuration
   * @return An object with dialog ID and a promise for the result
   */
  open<TComponent, TData = any, TResult = any>(
    dialog: DialogConfiguration<TComponent, TData, TResult>
  ): { id: string; result: Promise<TResult | null> } {
    if (dialog.dialogType === DialogType.MODAL) {
      this.enqueueDialog(this.modalQueue, dialog);
      this.tryOpenNextModal();
    } else if (dialog.dialogType === DialogType.OVERLAY) {
      this.enqueueDialog(this.overlayQueue, dialog);
      this.tryOpenNextOverlay();
    }

    const result = new Promise<TResult | null>((resolve) => {
      const checkInterval = setInterval(() => {
        const found =
          this.activeModal?.id === dialog.id ||
          this.activeOverlay?.id === dialog.id;
        if (found) {
          const ref =
            this.activeModal?.matDialogRef ??
            this.activeOverlay?.matDialogRef;
          ref?.afterClosed().subscribe((res) => {
            clearInterval(checkInterval);
            resolve(res ?? null);
          });
        }
      }, 100);
    });

    return { id: dialog.id, result };
  }

  /**
   * Insert into queue sorted by priority (descending)
   * @param queue The dialog queue
   * @param dialog The dialog to enqueue
   */
  private enqueueDialog(
    queue: DialogConfiguration<any>[],
    dialog: DialogConfiguration<any>
  ) {
    queue.push(dialog);
    queue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Try to open next modal if none active
   */
  private tryOpenNextModal() {
    if (this.activeModal || this.modalQueue.length === 0) return;
    const next = this.modalQueue.shift()!;
    this.activeModal = this.openDialog(next);

    this.activeModal.matDialogRef.afterClosed().subscribe(() => {
      this.activeModal = null;
      this.tryOpenNextModal();
    });
  }

  /**
   * Try to open next overlay if none active (auto-promotes above modal)
   */
  private tryOpenNextOverlay() {
    if (this.activeOverlay || this.overlayQueue.length === 0) return;
    const next = this.overlayQueue.shift()!;

    // Auto-promotion: temporarily "pause" the modal while overlay is open
    const pausedModal = this.activeModal;
    if (pausedModal) {
      this.setDialogBackdrop(pausedModal.matDialogRef, true);
    }

    this.activeOverlay = this.openDialog(next);

    this.activeOverlay.matDialogRef.afterClosed().subscribe(() => {
      this.activeOverlay = null;

      // Restore modal when overlay closes
      if (pausedModal) {
        this.setDialogBackdrop(pausedModal.matDialogRef, false);
      }

      this.tryOpenNextOverlay();
    });
  }

  /**
   * Open actual Material dialog
   * @param dialog The dialog configuration
   * @returns The tracked dialog instance
   */
  private openDialog<TComponent, TData, TResult>(
    dialog: DialogConfiguration<TComponent, TData, TResult>
  ): TrackedDialog {
    const ref = this.matDialog.open<
      TComponent,
      DialogComponentData<TData, TResult>
    >(dialog.component, dialog.config);

    // Layer control: overlays above modals
    const element = ref.componentInstance
      ? (ref as any)._containerInstance?._elementRef.nativeElement as HTMLElement
      : null;
    if (dialog.dialogType === DialogType.OVERLAY && element) {
      element.style.zIndex = '2000'; // higher than modal z-index
    } else if (dialog.dialogType === DialogType.MODAL && element) {
      element.style.zIndex = '1000';
    }

    return {
      id: dialog.id,
      matDialogRef: ref,
      component: dialog.component,
      dialogType: dialog.dialogType,
      priority: dialog.priority,
      openedAt: new Date(),
    };
  }

  /**
   * Helper: visually "pause" or "unpause" modal when overlay active
   * @param ref The dialog reference
   * @param pause Whether to pause (true) or unpause (false)
   */
  private setDialogBackdrop(ref: MatDialogRef<any>, pause: boolean) {
    const dialogEl = (ref as any)._containerInstance?._elementRef
      .nativeElement as HTMLElement | null;
    if (dialogEl) {
      dialogEl.style.pointerEvents = pause ? 'none' : 'auto';
      dialogEl.style.filter = pause ? 'blur(2px) brightness(0.7)' : 'none';
    }
  }

  /**
   * Close a dialog by ID
   * @param id The dialog ID
   * @param result Optional result to pass on close
   */
  close(id: string, result?: any): void {
    if (this.activeModal?.id === id) {
      this.activeModal.matDialogRef.close(result);
      this.activeModal = null;
      this.tryOpenNextModal();
      return;
    }

    if (this.activeOverlay?.id === id) {
      this.activeOverlay.matDialogRef.close(result);
      this.activeOverlay = null;
      this.tryOpenNextOverlay();
      return;
    }

    // Remove queued items if not opened yet
    this.modalQueue = this.modalQueue.filter((d) => d.id !== id);
    this.overlayQueue = this.overlayQueue.filter((d) => d.id !== id);
  }

  /**
   * Close all dialogs and queues
   */
  closeAll(): void {
    this.activeModal?.matDialogRef.close();
    this.activeOverlay?.matDialogRef.close();
    this.activeModal = null;
    this.activeOverlay = null;
    this.modalQueue = [];
    this.overlayQueue = [];
  }

  /**
   * Debug info: current queues
   * @return The current dialog queues and active dialogs
   */
  getQueues() {
    return {
      activeModal: this.activeModal,
      activeOverlay: this.activeOverlay,
      modalQueue: [...this.modalQueue],
      overlayQueue: [...this.overlayQueue],
    };
  }
}
