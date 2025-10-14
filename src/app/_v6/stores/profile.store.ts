import { inject, Injectable } from '@angular/core';
import {
  ProfileState,
  UserProfile,
  initialProfileState,
} from '../models/profile.model';
import { ComponentStore } from '@ngrx/component-store';
import { ProfileService } from '../services/profile.service';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { ProfileProcessingService } from '../services/profile-processing.service';

/**
 * ProfileStore manages the state of the user profile using ComponentStore.
 * It provides methods to load and update the profile, handling loading states
 * and errors appropriately.
 * https://ngrx.io/guide/component-store/lifecycle
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileStore extends ComponentStore<ProfileState> {
  private readonly profileService = inject(ProfileService);
  private readonly profileProcessingService = inject(ProfileProcessingService);

  constructor() {
    super(initialProfileState);
  }

  readonly loadProfile = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() =>
        this.profileService.loadProfile().pipe(
          tap((profile) => this.patchState({ profile })),
          catchError((err) => {
            this.patchState({ error: err.message });
            return of(null);
          }),
          finalize(() =>
            this.patchState({
              loading: false,
              saveable: false,
              processing: false,
            })
          )
        )
      )
    )
  );

  readonly updateProfile = this.effect<UserProfile>((profile$) =>
    profile$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap((profile) =>
        this.profileService.saveProfile(profile).pipe(
          tap((updated) =>
            this.patchState({ profile: updated, saveable: false })
          ),
          catchError((err) => {
            // Keep old profile visible, only update the error message
            this.patchState({ error: err.message });
            return of(null);
          }),
          finalize(() => this.patchState({ loading: false })) // reset saveable
        )
      )
    )
  );

  readonly processProfile = this.effect<UserProfile>((profile$) =>
    profile$.pipe(
      tap(() => this.patchState({ processing: true, error: null })),
      switchMap((profile) =>
        this.profileProcessingService.processProfile(profile).pipe(
          tap((processed) =>
            this.patchState({ profile: processed, saveable: true })
          ),
          catchError((err) => {
            this.patchState({ error: err.message });
            return of(null);
          }),
          finalize(() =>
            this.patchState({
              processing: false,
            })
          )
        )
      )
    )
  );

  readonly updateSaveable = this.updater<UserProfile>(
    (state, currentFormValue) => {
      const { profile } = state;
      if (!profile) {
        return { ...state, saveable: false };
      }

      const changed =
        profile.name !== currentFormValue.name ||
        profile.email !== currentFormValue.email ||
        profile.role !== currentFormValue.role;

      return { ...state, saveable: changed };
    }
  );
}
