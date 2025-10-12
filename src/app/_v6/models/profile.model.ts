export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error?: string;
}