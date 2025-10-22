import { UserProfile } from '../../../models/profile/profile.model';
import { DialogType } from '../../../models/shared/dialog-type';
import { DialogConfigFactory } from '../../../services/shared/dialog-config-factory';
import { ProfileFormComponent } from './profile-form.component';

export const PROFILE_FORM_ID = 'profile-form';

export const profileFormConfigFactory = (input: UserProfile | null = null) => {
  return DialogConfigFactory.createConfig<
    ProfileFormComponent,
    UserProfile,
    UserProfile
  >(PROFILE_FORM_ID, DialogType.MODAL, 1, ProfileFormComponent, input, {
    width: '600px',
    height: '500px',
  });
};
