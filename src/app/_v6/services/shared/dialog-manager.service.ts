import { ComponentType } from '@angular/cdk/portal';
import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { DialogType } from '../../models/shared/dialog-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly destroyRef = inject(DestroyRef);

  /** Queues per dialog type */
  private modalQueue: DialogConfiguration<any>[] = [];
  private overlayQueue: DialogConfiguration<any>[] = [];

  /** Currently active dialogs */
  private activeModal: TrackedDialog | null = null;
  private activeOverlay: TrackedDialog | null = null;

  /**
   * Open dialog with the given configuration
   * Queues the dialog if overlay or another dialog is active
   * @param dialog The dialog configuration
   * @return An object with dialog ID and a promise for the result
   */
  open<TComponent, TData = any, TResult = any>(
    dialog: DialogConfiguration<TComponent, TData, TResult>
  ): { id: string; result: Promise<TResult | null> } {
    if (dialog.dialogType === DialogType.MODAL) {
      // If overlay active — queue modal
      if (this.activeOverlay) {
        this.enqueueDialog(this.modalQueue, dialog);
      } else {
        this.enqueueDialog(this.modalQueue, dialog);
        this.tryOpenNextModal();
      }
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
            this.activeModal?.matDialogRef ?? this.activeOverlay?.matDialogRef;
          ref
            ?.afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
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
   * Try to open next modal only
   * if no overlay or modal active
   */
  private tryOpenNextModal() {
    if (this.activeModal || this.activeOverlay || this.modalQueue.length === 0)
      return;

    const next = this.modalQueue.shift()!;
    this.activeModal = this.openDialog(next);

    // Continue modal queue if overlay not blocking
    this.activeModal.matDialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.activeModal = null;
        this.tryOpenNextModal();
      });
  }

  /**
   * Try to open next overlay
   * always prioritized over modal
   */
  private tryOpenNextOverlay() {
    if (this.activeOverlay || this.overlayQueue.length === 0) return;
    const next = this.overlayQueue.shift()!;

    // If modal is active, pause its UI interaction
    if (this.activeModal) {
      this.setDialogBackdrop(this.activeModal.matDialogRef, true);
    }

    this.activeOverlay = this.openDialog(next);

    this.activeOverlay.matDialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.activeOverlay = null;

        if (this.activeModal) {
          // Restore modal interaction
          this.setDialogBackdrop(this.activeModal.matDialogRef, false);
        } else {
          // If no modal active, open queued modals
          this.tryOpenNextModal();
        }

        // Open next overlay if queued
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
      // dialogEl.style.filter = pause ? 'blur(2px) brightness(0.7)' : 'none';
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
   * Close all dialogs and reset queues
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
   * Get active modal dialog ID
   * @returns The active modal dialog ID or null
   */
  getActiveModalId(): string | null {
    return this.activeModal ? this.activeModal.id : null;
  }

  /**
   * Get active overlay dialog ID
   * @returns The active overlay dialog ID or null
   */
  getActiveOverlayId(): string | null {
    return this.activeOverlay ? this.activeOverlay.id : null;
  }

  /**
   * Check if a Modal with given ID is currently open
   * @param id The dialog ID
   * @return True if open, false otherwise
   */
  isModalOpen(id: string): boolean {
    return this.activeModal?.id === id;
  }

  /**
   * Check if a Modal with given ID is in the queue
   * @param id The dialog ID
   * @return True if in queue, false otherwise
   */
  isModalInQueue(id: string): boolean {
    return this.modalQueue.some((d) => d.id === id);
  }

  /**
   * Check if an Overlay with given ID is currently open
   * @param id The dialog ID
   * @return True if open, false otherwise
   */
  isOverlayOpen(id: string): boolean {
    return this.activeOverlay?.id === id;
  }

  /**
   * Check if an Overlay with given ID is in the queue
   * @param id The dialog ID
   * @return True if in queue, false otherwise
   */
  isOverlayInQueue(id: string): boolean {
    return this.overlayQueue.some((d) => d.id === id);
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
