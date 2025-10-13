import {
  Component,
  DestroyRef,
  effect,
  EffectRef,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileStore } from '../../stores/profile.store';
import { UserProfile } from '../../models/profile.model';

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
  }));

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
}
