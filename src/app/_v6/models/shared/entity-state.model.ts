import { UiState } from '../shared/ui-state.model';

export interface EntityState<T> extends UiState {
  entity: T | null;
}

export const initialEntityState = {
  entity: null,
  loading: false,
  processing: false,
  saveable: false,
  error: null,
};
