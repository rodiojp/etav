import { Component, inject } from '@angular/core';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { ProfileStore } from '../../../stores/profile.store';
import { PROFILE_DIALOG_ID } from '../profile-dialog/profile-dialog.name';

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './dialog-content-example.component.html',
  styleUrl: './dialog-content-example.component.scss',
})
export class DialogContentExampleComponent {
  private readonly store = inject(ProfileStore);

  private readonly dialogs = inject(DialogManagerService);
  readonly profileStateSignal = this.store.selectSignal((state) => ({
    profile: state.entity,
  }));

  async openProfileDialog() {
    const { profile } = this.profileStateSignal();
    if (!profile) return;

    const config = {
      id: PROFILE_DIALOG_ID,
      component: ProfileDialogComponent,
      data: profile,
      width: '500px',
      height: null,
      panelClass: 'profile-dialog-panel',
    };

    // Open using DialogManagerService
    const { result } = this.dialogs.open(config);

    // Wait for dialog result
    const updatedProfile = await result;
    if (updatedProfile) {
      console.log('Dialog returned updated profile:', updatedProfile);

      // update store
      this.store.saveEntity(updatedProfile);
      this.store.updateSaveable(updatedProfile);
    }
  }
}
