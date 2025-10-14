import { EntityState } from '../shared/entity-state.model';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export type ProfileState = EntityState<UserProfile>;
