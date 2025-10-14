import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';
import {
  ProfileTemplates,
  SharedDialogTemplatesService,
} from '../../../services/dialog-one/shared-dialog-templates.service';

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrl: './test-dialog.component.scss',
})
export class TestDialogComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly sharedService = inject(SharedDialogTemplatesService);

  private readonly destroyRef = inject(DestroyRef);

  private profileTemplates: ProfileTemplates | null = null;

  ngOnInit(): void {
    const profileTemplatesSubscription =
      this.sharedService.profileTemplates$.subscribe((templates) => {
        this.profileTemplates = templates;
      });
    this.destroyRef.onDestroy(() => {
      profileTemplatesSubscription.unsubscribe();
    });
  }

  openProfileDialog() {
    if (
      !this.profileTemplates ||
      !this.profileTemplates.header ||
      !this.profileTemplates.content ||
      !this.profileTemplates.actions
    ) {
      console.error('Profile templates are not available.');
      return;
    }
    const dialogRef = this.dialog.open(BaseDialogComponent, {
      width: '450px',
    });

    dialogRef.componentInstance.headerTemplate = this.profileTemplates.header;
    dialogRef.componentInstance.contentTemplate = this.profileTemplates.content;
    dialogRef.componentInstance.actionsTemplate = this.profileTemplates.actions;
  }
}
