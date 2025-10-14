import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseDialogComponent } from './components/dialog-one/base-dialog/base-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogTemplatesComponent } from './components/dialog-one/profile-dialog-templates/profile-dialog-templates.component';
import { TestDialogComponent } from './components/dialog-one/test-dialog/test-dialog.component';

@NgModule({
  declarations: [
    ProfileComponent,
    BaseDialogComponent,
    ProfileDialogTemplatesComponent,
    TestDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FontAwesomeModule,
  ],
  exports: [ProfileComponent, TestDialogComponent],
})
export class V6Module {}
