import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserProfile } from '../../models/profile.model';

export interface ProfileFormFields {
  name: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<string | null>;
}

export type ProfileFormType = FormGroup<ProfileFormFields>;

export function createProfileForm(
  fb: FormBuilder,
  profile?: UserProfile
): ProfileFormType {
  const form = fb.group({
    name: fb.nonNullable.control(profile?.name ?? '', Validators.required),
    email: fb.nonNullable.control(profile?.email ?? '', [
      Validators.required,
      Validators.email,
    ]),
    role: fb.control<string | null>(profile?.role ?? null),
  });
  return form;
}
