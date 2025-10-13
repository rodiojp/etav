import { Injectable } from '@angular/core';
import {
  ProfileState,
  UserProfile,
  initialProfileState,
} from '../models/profile.model';
import { ComponentStore } from '@ngrx/component-store';
import { ProfileService } from '../services/profile.service';
import { finalize, switchMap, tap } from 'rxjs';

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
  readonly profile$ = this.select((s) => s.profile);
  readonly loading$ = this.select((s) => s.loading);
  readonly profileState$ = this.select((profileState) => profileState);

  constructor(private profileService: ProfileService) {
    super(initialProfileState);
  }

  readonly loadProfile = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() =>
        this.profileService.loadProfile().pipe(
          tap({
            next: (profile) => this.patchState({ profile }),
            error: (err) => this.patchState({ error: err.message }),
          }),
          finalize(() => this.patchState({ loading: false })) // always turn off loading
        )
      )
    )
  );

  readonly updateProfile = this.effect<UserProfile>((profile$) =>
    profile$.pipe(
      tap(() => this.patchState({ loading: true })), // show spinner before save
      switchMap((profile) =>
        this.profileService.saveProfile(profile).pipe(
          tap({
            next: (updated) => this.patchState({ profile: updated }),
            error: (err) =>
              this.patchState({ profile: null, error: err.message }),
          }),
          finalize(() => this.patchState({ loading: false })) // always hide spinner
        )
      )
    )
  );
}
