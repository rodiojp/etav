import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { UserProfile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileRepository {
  private readonly baseUrl = '/api/profile';

  // Fake in-memory data
  private mockProfile: UserProfile = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  /**
   * Simulate GET /api/profile
   */
  getProfile(): Observable<UserProfile> {
    console.log('[Mock API] GET', this.baseUrl);
    return of(this.mockProfile).pipe(delay(800)); // simulate 800ms latency
  }

  /**
   * Simulate PUT /api/profile
   */
  updateProfile(profile: UserProfile): Observable<UserProfile> {
    console.log('[Mock API] PUT', this.baseUrl, profile);

    // Fake update in memory
    this.mockProfile = { ...this.mockProfile, ...profile };

    return of(this.mockProfile).pipe(
      delay(600), // simulate network delay
      map((updated) => {
        console.log('[Mock API] Response:', updated);
        return updated;
      })
    );
  }
}
