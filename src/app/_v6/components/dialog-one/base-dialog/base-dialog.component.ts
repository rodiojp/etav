import {
  Component,
  Input,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDialogComponent {
  @Input() headerTemplate!: TemplateRef<any>;
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() actionsTemplate!: TemplateRef<any>;

  faTimes = faTimes;

  constructor(private dialogRef: MatDialogRef<BaseDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
