import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDialogTemplatesComponent } from './profile-dialog-templates.component';

describe('ProfileDialogTemplatesComponent', () => {
  let component: ProfileDialogTemplatesComponent;
  let fixture: ComponentFixture<ProfileDialogTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileDialogTemplatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileDialogTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
