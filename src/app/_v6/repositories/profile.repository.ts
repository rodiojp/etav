import { Injectable } from '@angular/core';
import { delay, map, mergeMap, Observable, of, throwError, timer } from 'rxjs';
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
    const delayMs = 2000;

    // Simple server validation
    if (!profile.name || !profile.email) {
      console.error('[Fake HTTP] Error:', 'Invalid profile data');
      return timer(delayMs).pipe(
        mergeMap(() => throwError(() => new Error('Invalid profile data')))
      );
    }

    // Simulate random API failure
    if (Math.random() < 0.5) {
      console.error('[Fake HTTP] Error:', 'Random API failure');
      return timer(delayMs).pipe(
        mergeMap(() => throwError(() => new Error('Random API failure')))
      );
    }

    // Fake update in memory
    this.mockProfile = { ...this.mockProfile, ...profile };

    return of(this.mockProfile).pipe(
      delay(delayMs),
      map((updated) => {
        console.log('[Mock API] Response:', updated);
        return updated;
      })
    );
  }
}
