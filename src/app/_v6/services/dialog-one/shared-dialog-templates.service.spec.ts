import { TestBed } from '@angular/core/testing';

import { SharedDialogTemplatesService } from './shared-dialog-templates.service';

describe('SharedDialogTemplatesService', () => {
  let service: SharedDialogTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDialogTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
