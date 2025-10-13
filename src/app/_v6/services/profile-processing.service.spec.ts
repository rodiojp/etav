import { TestBed } from '@angular/core/testing';

import { ProfileProcessingService } from './profile-processing.service';

describe('ProfileProcessingService', () => {
  let service: ProfileProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
