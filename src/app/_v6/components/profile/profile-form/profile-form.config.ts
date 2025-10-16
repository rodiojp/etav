import { UserProfile } from '../../../models/profile/profile.model';
import { DialogConfigFactory } from '../../../services/shared/dialog-config-factory';
import { ProfileFormComponent } from './profile-form.component';

export const PROFILE_FORM_ID = 'profile-form';

export const profileFormConfigFactory = (input: UserProfile | null) => {
  return DialogConfigFactory.createConfig<
    UserProfile,
    UserProfile,
    ProfileFormComponent
  >(PROFILE_FORM_ID, ProfileFormComponent, input, {
    width: '600px',
    height: '500px',
    panelClass: 'profile-dialog-panel',
  });
};
