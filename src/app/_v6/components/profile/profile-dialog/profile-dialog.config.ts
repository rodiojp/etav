import { UserProfile } from '../../../models/profile/profile.model';
import { DialogConfigFactory } from '../../../services/shared/dialog-config-factory';
import { ProfileDialogComponent } from './profile-dialog.component';

export const PROFILE_DIALOG_ID = 'profile-dialog';

export const profileDialogConfigFactory = (input: UserProfile | null) => {
  return DialogConfigFactory.createConfig<
    UserProfile,
    UserProfile,
    ProfileDialogComponent
  >(PROFILE_DIALOG_ID, ProfileDialogComponent, input, {
    width: '500px',
    panelClass: 'profile-dialog-panel',
  });
};
