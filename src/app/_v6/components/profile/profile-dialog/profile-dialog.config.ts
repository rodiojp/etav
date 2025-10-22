import { UserProfile } from '../../../models/profile/profile.model';
import { DialogType } from '../../../models/shared/dialog-type';
import { DialogConfigFactory } from '../../../services/shared/dialog-config-factory';
import { ProfileDialogComponent } from './profile-dialog.component';

export const PROFILE_DIALOG_ID = 'profile-dialog';

export const profileDialogConfigFactory = (input: UserProfile | null) => {
  return DialogConfigFactory.createConfig<
    ProfileDialogComponent,
    UserProfile,
    UserProfile
  >(PROFILE_DIALOG_ID, DialogType.MODAL, 2,ProfileDialogComponent, input, {
    width: '500px',
    disableClose: true,
  });
};
