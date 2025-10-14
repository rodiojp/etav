import { inject, Injectable } from '@angular/core';
import { ProfileRepository } from '../../repositories/profile/profile.repository';
import { UserProfile } from '../../models/profile/profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly repo = inject(ProfileRepository);

  loadProfile(): Observable<UserProfile> {
    return this.repo.getProfile();
  }

  saveProfile(profile: UserProfile): Observable<UserProfile> {
    return this.repo.updateProfile(profile);
  }
}
