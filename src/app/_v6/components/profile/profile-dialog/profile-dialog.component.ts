import { Component, Inject, inject } from '@angular/core';
import { createProfileForm, ProfileFormType } from '../profile-form.factory';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from '../../../models/profile.model';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss',
})
export class ProfileDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly form: ProfileFormType = createProfileForm(this.fb);

  constructor(
    private readonly dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProfile
  ) {
    if (data) this.form.patchValue(data);
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
