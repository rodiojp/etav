import { Component, inject } from '@angular/core';
import { ProfileDialogComponent } from '../profile/profile-dialog/profile-dialog.component';
import { DialogManagerService } from '../../services/shared/dialog-manager.service';
import { ProfileStore } from '../../stores/profile/profile.store';
import { profileDialogConfigFactory } from '../profile/profile-dialog/profile-dialog.config';
import { ProfileFormComponent } from '../profile/profile-form/profile-form.component';
import { profileFormConfigFactory } from '../profile/profile-form/profile-form.config';
import { UserProfile } from '../../models/profile/profile.model';
import { volumeOverlayConfigFactory } from '../volume-overlay/volume-overlay.config';
import { VolumeOverlayComponent } from '../volume-overlay/volume-overlay.component';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrl: './dialog-test.component.scss',
})
export class DialogTestComponent {
  private readonly store = inject(ProfileStore);

  private readonly dialogs = inject(DialogManagerService);

  /**
   * Open Profile Dialog
   * Handles both creating new profile and editing existing one
   */
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
    }
  }

  /**
   * Open Profile Form Dialog
   * ignore the returned result for this example
   */
  async openProfileForm() {
    const config = profileFormConfigFactory();
    // Open using DialogManagerService
    this.dialogs.open<ProfileFormComponent>(config);
  }

  /**
   * Open Volume Overlay Dialog
   * ignore the returned result for this example
   */
  async openVolumeOverlay() {
    const config = volumeOverlayConfigFactory();
    this.dialogs.open<VolumeOverlayComponent>(config);
  }

  /**
   * Open Profile Form, then after 5 seconds open Volume Overlay
   */
  async openProfileFormThenOpenVolumeOverlay() {
    await this.openProfileForm();
    setTimeout(() => {
      this.openVolumeOverlay();
    }, 5000);
  }

  /**
   * Open Volume Overlay, then close it after 5 seconds
   * ignores the returned result for this example
   */
  async openVolumeOverlayThenCloseIt() {
    const { id } = this.dialogs.open<VolumeOverlayComponent>(
      volumeOverlayConfigFactory()
    );
    console.log('Opened Volume Overlay with id:', id);
    setTimeout(() => {
      this.dialogs.close(id);
      console.log('Closed Volume Overlay with id:', id);
    }, 5000);
  }
}
