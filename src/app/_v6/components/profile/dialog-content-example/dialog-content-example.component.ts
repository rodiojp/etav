import { Component, inject } from '@angular/core';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { DialogManagerService } from '../../../services/shared/dialog-manager.service';
import { ProfileStore } from '../../../stores/profile/profile.store';
import { profileDialogConfigFactory } from '../profile-dialog/profile-dialog.config';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { profileFormConfigFactory } from '../profile-form/profile-form.config';
import { UserProfile } from '../../../models/profile/profile.model';

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './dialog-content-example.component.html',
  styleUrl: './dialog-content-example.component.scss',
})
export class DialogContentExampleComponent {
  private readonly store = inject(ProfileStore);

  private readonly dialogs = inject(DialogManagerService);

  async openProfileDialog() {
    let profile = null;
    if (Math.random() < 0.5) {
      console.log('Opening dialog to create new profile');
    } else {
      profile = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'Administrator',
      };
    }
    const config = profileDialogConfigFactory(profile);

    // Open using DialogManagerService
    const { result } = this.dialogs.open<
      ProfileDialogComponent,
      UserProfile,
      UserProfile
    >(config);

    // Wait for dialog result
    const updatedProfile = await result;
    if (updatedProfile) {
      console.log('Dialog returned updated profile:', updatedProfile);

      // update store
      this.store.saveEntity(updatedProfile);
      this.store.updateSaveable(updatedProfile);
    }
  }

  async openProfileForm() {
    let profile = null;
    const config = profileFormConfigFactory(profile);
    // Open using DialogManagerService
    const { result } = this.dialogs.open<
      ProfileFormComponent,
      UserProfile,
      UserProfile
    >(config);
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
