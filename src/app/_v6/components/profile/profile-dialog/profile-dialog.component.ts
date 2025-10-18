import { Component, inject, OnInit } from '@angular/core';
import { createProfileForm, ProfileFormType } from '../profile-form.factory';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: [
    './profile-dialog.component.scss',
    '../../../styles/dialog-shared.scss',
  ],
})
export class ProfileDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  readonly form: ProfileFormType = createProfileForm(this.fb);
  readonly title =
    this.data && this.data.input ? 'Edit Profile' : 'New Profile';
  faTimes = faTimes;

  readonly isEditMode = !!(this.data && this.data.input);
  ngOnInit(): void {
    if (this.data && this.data.input) {
      this.form.patchValue(this.data.input);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
