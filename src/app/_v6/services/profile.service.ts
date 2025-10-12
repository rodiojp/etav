import { inject, Injectable } from '@angular/core';
import { ProfileRepository } from '../repositories/profile.repository';
import { UserProfile } from '../models/profile.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  
  private readonly repo = inject(ProfileRepository);

  loadProfile() {
    return this.repo.getProfile();
  }

  saveProfile(profile: UserProfile) {
    return this.repo.updateProfile(profile).pipe(map((res) => res));
  }
}
