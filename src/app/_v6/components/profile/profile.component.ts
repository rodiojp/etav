import {
  Component,
  DestroyRef,
  effect,
  EffectRef,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileStore } from '../../stores/profile.store';
import { UserProfile } from '../../models/profile.model';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private readonly store = inject(ProfileStore);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly vmSignal = this.store.selectSignal((state) => ({
    profile: state.profile,
    loading: state.loading,
    processing: state.processing,
    error: state.error,
  }));

  readonly faExclamationTriangle = faExclamationTriangle;

  readonly formProfile = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    role: this.fb.control<string | null>(null),
  });

  // Effect defined as a class field, within the injection context
  private readonly syncFormWithVm: EffectRef = effect(() => {
    const { profile, loading } = this.vmSignal();
    console.log('VM changed:', { profile, loading });

    // Disable/enable form based on loading
    if (loading) {
      this.formProfile.disable({ emitEvent: false });
    } else {
      this.formProfile.enable({ emitEvent: false });
    }

    // Only patch form when profile changes (avoid re-patching during save)
    if (profile && !loading) {
      const current = this.formProfile.getRawValue();
      const changed =
        current.name !== profile.name ||
        current.email !== profile.email ||
        current.role !== profile.role;

      if (changed) {
        this.formProfile.patchValue(profile, { emitEvent: false });
      }
    }
  });

  constructor() {
    this.store.loadProfile();
    this.destroyRef.onDestroy(() => {
      this.syncFormWithVm.destroy();
    });
  }

  onSave() {
    if (this.formProfile.valid) {
      const viewModel = this.vmSignal();
      const profile: UserProfile = {
        ...viewModel.profile!,
        ...this.formProfile.getRawValue(),
      };
      console.log('Saving profile', profile);
      this.store.updateProfile(profile);
    } else {
      this.formProfile.markAllAsTouched();
    }
  }

  onProcess() {
    if (this.formProfile.valid) {
      const viewModel = this.vmSignal();
      const profile: UserProfile = {
        ...viewModel.profile!,
        ...this.formProfile.getRawValue(),
      };
      console.log('Processing profile', profile);
      this.store.processProfile(profile);
    } else {
      this.formProfile.markAllAsTouched();
    }
  }
}
