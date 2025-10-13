export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};
