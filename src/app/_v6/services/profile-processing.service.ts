import { Injectable } from '@angular/core';
import { UserProfile } from '../models/profile.model';
import { delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileProcessingService {
  /**
   * Fake processing: e.g., capitalize name, validate email, etc.
   */
  processProfile(profile: UserProfile): Observable<UserProfile> {
    const delayMs = 2000;
    return of(profile).pipe(
      delay(delayMs), // simulate async processing
      map((p) => ({
        ...p,
        name: p.name.toUpperCase(), // example transformation
      }))
    );
  }
}
