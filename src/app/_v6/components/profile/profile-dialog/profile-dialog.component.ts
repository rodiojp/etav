import { Component, inject, OnInit } from '@angular/core';
import { createProfileForm, ProfileFormType } from '../profile-form.factory';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from '../../../models/profile/profile.model';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss',
})
export class ProfileDialogComponent implements OnInit {
  
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
  readonly data = inject<UserProfile>(MAT_DIALOG_DATA);

  readonly form: ProfileFormType = createProfileForm(this.fb);

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
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
