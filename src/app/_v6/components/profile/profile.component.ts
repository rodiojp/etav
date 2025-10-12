import { Component, inject, OnInit } from '@angular/core';
import { ProfileStore } from '../../stores/profile.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  
  private readonly store = inject(ProfileStore);
  private readonly fb = inject(FormBuilder);

  readonly vm$ = this.store.select((state) => ({
    profile: state.profile,
    loading: state.loading,
  }));

  form!: FormGroup;

  ngOnInit() {
    this.store.loadProfile();

    // Build an empty form initially
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
    });

    // Subscribe to profile updates and patch the form when data arrives
    this.vm$.subscribe(({ profile }) => {
      if (profile) {
        this.form.patchValue(profile);
      }
    });
  }

  onSave(profile: any) {
    if (this.form.valid) {
      this.store.updateProfile(profile);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
