import {
  Component,
  computed,
  DestroyRef,
  effect,
  EffectRef,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProfileStore } from '../../../stores/profile/profile.store';
import { UserProfile } from '../../../models/profile/profile.model';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { createProfileForm, ProfileFormType } from '../profile-form.factory';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent {
  private readonly store = inject(ProfileStore);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly faExclamationTriangle = faExclamationTriangle;

  readonly profileStateSignal = this.store.selectSignal((state) => ({
    profile: state.entity,
  }));

  readonly stateSignal = this.store.selectSignal((state) => ({
    loading: state.loading,
    processing: state.processing,
    saveable: state.saveable,
    error: state.error,
  }));

  readonly form: ProfileFormType = createProfileForm(this.fb);

  private lastProfileRef: UserProfile | null = null;

  // Effect defined as a class field, within the injection context
  private readonly syncFormWithVm: EffectRef = effect(() => {
    const { profile } = this.profileStateSignal();
    const { loading } = this.stateSignal(); // separate reactive dependency
    console.log('VM changed:', { profile, loading });

    // Only react if the actual profile object instance changes
    if (profile === this.lastProfileRef) return;

    this.lastProfileRef = profile;

    // Disable/enable form based on loading
    if (loading) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }

    // Only patch form when profile changes (avoid re-patching during save)
    if (profile && !loading) {
      const current = this.form.getRawValue();
      const changed =
        current.name !== profile.name ||
        current.email !== profile.email ||
        current.role !== profile.role;

      if (changed) {
        this.form.patchValue(profile, { emitEvent: false });
      }
    }
  });

  readonly canSave = computed(() => {
    const state = this.stateSignal();
    return (
      this.form.valid && state.saveable && !state.loading && !state.processing
    );
  });

  readonly canProcess = computed(() => {
    const state = this.stateSignal();
    return this.form.valid && !state.loading && !state.processing;
  });

  constructor() {
    this.store.loadEntity();

    // Track form changes to know if Save should be enabled
    this.form.valueChanges.subscribe((formValue) => {
      this.store.updateSaveable(formValue as UserProfile);
    });

    this.destroyRef.onDestroy(() => {
      this.syncFormWithVm.destroy();
    });
  }

  onSave() {
    if (this.form.valid) {
      const viewModel = this.profileStateSignal();
      const profile: UserProfile = {
        ...viewModel.profile!,
        ...this.form.getRawValue(),
      };
      console.log('Saving profile', profile);
      this.store.saveEntity(profile);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onProcess() {
    if (this.form.valid) {
      const viewModel = this.profileStateSignal();
      const profile: UserProfile = {
        ...viewModel.profile!,
        ...this.form.getRawValue(),
      };
      console.log('Processing profile', profile);
      this.store.processEntity(profile);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
