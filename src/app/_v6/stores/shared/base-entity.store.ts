import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  of,
  tap,
} from 'rxjs';
import {
  EntityState,
  initialEntityState,
} from '../../models/shared/entity-state.model';

/**
 * A lightweight reactive store using RxJS instead of ComponentStore.
 * Handles loading, saving, and processing entities with reactive state updates.
 */
export abstract class BaseEntityStore<T> {
  private readonly stateSubject = new BehaviorSubject<EntityState<T>>(
    initialEntityState
  );
  readonly state$ = this.stateSubject.asObservable();

  /** Shortcut accessors */
  get state(): EntityState<T> {
    return this.stateSubject.value;
  }

  protected setState(partial: Partial<EntityState<T>>) {
    const current = this.stateSubject.value;
    const next = { ...current, ...partial };

    // Only emit if something actually changed
    if (!this.shallowEqual(current, next)) {
      this.stateSubject.next(next);
    }
  }

  protected abstract loadEntity$(): Observable<T>;
  protected abstract saveEntity$(entity: T): Observable<T>;
  protected abstract processEntity$(entity: T): Observable<T>;

  /** Loads entity and updates state reactively */
  loadEntity(): void {
    this.setState({ loading: true, error: null });

    this.loadEntity$()
      .pipe(
        tap((entity: T) => this.setState({ entity })),
        catchError((err) => {
          this.setState({ error: err.message });
          return of(null);
        }),
        finalize(() => this.setState({ loading: false, processing: false }))
      )
      .subscribe();
  }

  /** Saves entity and updates state */
  saveEntity(entity: T): void {
    this.setState({ loading: true, error: null });

    this.saveEntity$(entity)
      .pipe(
        tap((updated: T) =>
          this.setState({ entity: updated, saveable: false })
        ),
        catchError((err) => {
          this.setState({ error: err.message });
          return of(null);
        }),
        finalize(() => this.setState({ loading: false }))
      )
      .subscribe();
  }

  /** Processes entity and marks saveable */
  processEntity(entity: T): void {
    this.setState({ processing: true, error: null });

    this.processEntity$(entity)
      .pipe(
        tap((processed: T) =>
          this.setState({ entity: processed, saveable: true })
        ),
        catchError((err) => {
          this.setState({ error: err.message });
          return of(null);
        }),
        finalize(() => this.setState({ processing: false }))
      )
      .subscribe();
  }

  /** Updates saveable flag based on comparison */
  updateSaveable(currentValue: T): void {
    const changed =
      JSON.stringify(this.state.entity) !== JSON.stringify(currentValue);
    this.setState({ saveable: changed });
  }

  private shallowEqual(a: any, b: any): boolean {
    if (a === b) return true;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => a[key] === b[key]);
  }
}
