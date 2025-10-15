import { Component, inject } from '@angular/core';
import { DialogManagerService } from '../../../services/shared/dialog-manager.service';
import { PROFILE_DIALOG_ID } from '../profile-dialog/profile-dialog.name';
import { ProfileFormComponent } from '../profile-form/profile-form.component';

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './dialog-content-example.component.html',
  styleUrl: './dialog-content-example.component.scss',
})
export class DialogContentExampleComponent {
  private readonly dialogs = inject(DialogManagerService);

  async openProfileDialog() {
    this.dialogs.open({
      id: PROFILE_DIALOG_ID,
      component: ProfileFormComponent,
      width: '500px',
      data: null,
      height: null,
      panelClass: null,
    });
  }
}
