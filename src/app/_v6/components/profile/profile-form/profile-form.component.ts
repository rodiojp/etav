import { Component, inject, computed, DestroyRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, distinctUntilChanged } from 'rxjs';
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
  readonly form: ProfileFormType = createProfileForm(this.fb);

  // Convert store state$ (BehaviorSubject) → signal for easy template binding
  readonly stateSignal = toSignal(this.store.state$, {
    initialValue: this.store.state,
  });

  readonly profileSignal = computed(() => this.stateSignal().entity);
  readonly loadingSignal = computed(() => this.stateSignal().loading);
  readonly processingSignal = computed(() => this.stateSignal().processing);
  readonly saveableSignal = computed(() => this.stateSignal().saveable);
  readonly errorSignal = computed(() => this.stateSignal().error);

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
    // Load profile initially
    this.store.loadEntity();

    // Sync form with store changes reactively
    this.store.state$
      .pipe(
        map((s) => ({
          profile: s.entity,
          loading: s.loading,
          processing: s.processing,
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.profile === curr.profile &&
            prev.loading === curr.loading &&
            prev.processing === curr.processing
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ profile, loading, processing }) => {
        // Handle form enable/disable cleanly
        const shouldDisable = loading || processing;
        if (shouldDisable && this.form.enabled) {
          this.form.disable({ emitEvent: false });
        } else if (!shouldDisable && this.form.disabled) {
          this.form.enable({ emitEvent: false });
        }

        // Only patch when entity really changed
        if (profile && !shouldDisable) {
          const current = this.form.getRawValue();

          // Compare only top-level fields we care about
          const changed =
            current.name !== profile.name ||
            current.email !== profile.email ||
            current.role !== profile.role;

          if (changed) {
            this.form.patchValue(profile, { emitEvent: false });
          }
        }
      });

    // Watch form changes to determine if Save should be enabled
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formValue) => {
        this.store.updateSaveable(formValue as UserProfile);
      });
  }

  onSave() {
    if (this.form.valid) {
      const profile = {
        ...this.profileSignal(),
        ...this.form.getRawValue(),
      } as UserProfile;
      console.log('Saving profile', profile);
      this.store.saveEntity(profile);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onProcess() {
    if (this.form.valid) {
      const profile = {
        ...this.profileSignal(),
        ...this.form.getRawValue(),
      } as UserProfile;
      console.log('Processing profile', profile);
      this.store.processEntity(profile);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
