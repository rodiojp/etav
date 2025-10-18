import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeOverlayComponent } from './volume-overlay.component';

describe('VolumeOverlayComponent', () => {
  let component: VolumeOverlayComponent;
  let fixture: ComponentFixture<VolumeOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolumeOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolumeOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
