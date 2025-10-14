import { Injectable, inject } from '@angular/core';
import { UserProfile } from '../models/profile.model';
import { ProfileService } from '../services/profile.service';
import { ProfileProcessingService } from '../services/profile-processing.service';
import { Observable } from 'rxjs';
import { BaseEntityStore } from './shared/base-entity.store';

@Injectable({ providedIn: 'root' })
export class ProfileStore extends BaseEntityStore<UserProfile> {
  private readonly profileService = inject(ProfileService);
  private readonly processingService = inject(ProfileProcessingService);

  protected override loadEntity$(): Observable<UserProfile> {
    return this.profileService.loadProfile();
  }

  protected override saveEntity$(entity: UserProfile): Observable<UserProfile> {
    return this.profileService.saveProfile(entity);
  }

  protected override processEntity$(entity: UserProfile): Observable<UserProfile> {
    return this.processingService.processProfile(entity);
  }
}
