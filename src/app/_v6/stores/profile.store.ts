import { Injectable } from '@angular/core';
import { ProfileState, UserProfile } from '../models/profile.model';
import { ComponentStore } from '@ngrx/component-store';
import { ProfileService } from '../services/profile.service';
import { switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore extends ComponentStore<ProfileState> {
  readonly profile$ = this.select((s) => s.profile);
  readonly loading$ = this.select((s) => s.loading);

  constructor(private profileService: ProfileService) {
    super({ profile: null, loading: false });
  }

  readonly loadProfile = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })), // show spinner before load
      switchMap(() =>
        this.profileService.loadProfile().pipe(
          tap({
            next: (profile) => this.patchState({ profile, loading: false }), // hide spinner
            error: (err) =>
              this.patchState({ loading: false, error: err.message }), // hide spinner on error
          })
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
            next: (updated) =>
              this.patchState({ profile: updated, loading: false }), // hide spinner
            error: (err) =>
              this.patchState({ loading: false, error: err.message }), // hide spinner on error
          })
        )
      )
    )
  );
}
