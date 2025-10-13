import { Injectable } from '@angular/core';
import { delay, map, Observable, of, throwError } from 'rxjs';
import { UserProfile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileRepository {
  private readonly baseUrl = '/api/profile';

  // Fake in-memory data
  private mockProfile: UserProfile = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'User',
  };

  /**
   * Simulate GET /api/profile
   */
  getProfile(): Observable<UserProfile> {
    console.log('[Mock API] GET', this.baseUrl);
    return of(this.mockProfile).pipe(delay(1000));
  }

  /**
   * Simulate PUT /api/profile
   */
  updateProfile(profile: UserProfile): Observable<UserProfile> {
    console.log('[Mock API] PUT', this.baseUrl, profile);

    // random failure simulation
    if (Math.random() < 0.5) {
      return throwError(() => new Error('Random API failure'));
    }
    // Simple validation
    if (!profile.name || !profile.email) {
      return throwError(() => new Error('Invalid profile data'));
    }

    // Fake update in memory
    this.mockProfile = { ...this.mockProfile, ...profile };

    return of(this.mockProfile).pipe(
      delay(2000),
      map((updated) => {
        console.log('[Mock API] Response:', updated);
        return updated;
      })
    );
  }
}
