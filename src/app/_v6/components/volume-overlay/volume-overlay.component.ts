import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-volume-overlay',
  templateUrl: './volume-overlay.component.html',
  styleUrls: [
    './volume-overlay.component.scss',
    '../../styles/dialog-shared.scss',
  ],
})
export class VolumeOverlayComponent {
  faTimes = faTimes;
  private readonly dialogRef = inject(MatDialogRef<VolumeOverlayComponent>);

  onCancel() {
    this.dialogRef.close();
  }
}
