export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error?: string;
}