import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogTestComponent } from './components/dialog-test/dialog-test.component';
import { ProfileDialogComponent } from './components/profile/profile-dialog/profile-dialog.component';
import { ProfileFormComponent } from './components/profile/profile-form/profile-form.component';
import { VolumeOverlayComponent } from './components/volume-overlay/volume-overlay.component';

@NgModule({
  declarations: [
    ProfileFormComponent,
    DialogTestComponent,
    ProfileDialogComponent,
    VolumeOverlayComponent,
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
  exports: [ProfileFormComponent, DialogTestComponent],
})
export class V6Module {}
