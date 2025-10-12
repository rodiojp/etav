import { Injectable } from "@angular/core";
import { ProfileState } from "../models/profile.model";

@Injectable()
export class ProfileStore extends ComponentStore<ProfileState> {
  readonly profile$ = this.select(s => s.profile);
  readonly loading$ = this.select(s => s.loading);

  constructor(private profileService: ProfileService) {
    super({ profile: null, loading: false });
  }

  readonly loadProfile = this.effect(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() =>
        this.profileService.loadProfile().pipe(
          tap({
            next: profile => this.patchState({ profile, loading: false }),
            error: err =>
              this.patchState({ loading: false, error: err.message })
          })
        )
      )
    )
  );

  readonly updateProfile = this.effect<UserProfile>(profile$ =>
    profile$.pipe(
      switchMap(profile =>
        this.profileService.saveProfile(profile).pipe(
          tap({
            next: updated =>
              this.patchState({ profile: updated, loading: false }),
            error: err => this.patchState({ error: err.message })
          })
        )
      )
    )
  );
}