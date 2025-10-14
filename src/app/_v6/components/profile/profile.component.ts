import {
  Component,
  computed,
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

  // readonly vmSignal = computed(() => ({
  //   ...this.profileStateSignal(),
  //   ...this.stateSignal(),
  // }));

  readonly formProfile = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    role: this.fb.control<string | null>(null),
  });

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

  readonly canSave = computed(() => {
    const state = this.stateSignal();
    return (
      this.formProfile.valid &&
      state.saveable &&
      !state.loading &&
      !state.processing
    );
  });

  readonly canProcess = computed(() => {
    const state = this.stateSignal();
    return this.formProfile.valid && !state.loading && !state.processing;
  });

  constructor() {
    this.store.loadEntity();

    // Track form changes to know if Save should be enabled
    this.formProfile.valueChanges.subscribe((formValue) => {
      this.store.updateSaveable(formValue as UserProfile);
    });

    this.destroyRef.onDestroy(() => {
      this.syncFormWithVm.destroy();
    });
  }

  onSave() {
    if (this.formProfile.valid) {
      const viewModel = this.profileStateSignal();
      const profile: UserProfile = {
        ...viewModel.profile!,
        ...this.formProfile.getRawValue(),
      };
      console.log('Saving profile', profile);
      this.store.saveEntity(profile);
    } else {
      this.formProfile.markAllAsTouched();
    }
  }

  onProcess() {
    if (this.formProfile.valid) {
      const viewModel = this.profileStateSignal();
      const profile: UserProfile = {
        ...viewModel.profile!,
        ...this.formProfile.getRawValue(),
      };
      console.log('Processing profile', profile);
      this.store.processEntity(profile);
    } else {
      this.formProfile.markAllAsTouched();
    }
  }
}
