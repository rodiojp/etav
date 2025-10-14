import { ComponentStore } from '@ngrx/component-store';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import {
  EntityState,
  initialEntityState,
} from '../../models/shared/entity-state.model';

export abstract class BaseEntityStore<T> extends ComponentStore<
  EntityState<T>
> {
  constructor() {
    super(initialEntityState);
  }

  protected abstract loadEntity$(): any;
  protected abstract saveEntity$(entity: T): any;
  protected abstract processEntity$(entity: T): any;

  readonly loadEntity = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() =>
        this.loadEntity$().pipe(
          tap((entity: T) => this.patchState({ entity })),
          catchError((err) => {
            this.patchState({ error: err.message });
            return of(null);
          }),
          finalize(() => this.patchState({ loading: false, processing: false }))
        )
      )
    )
  );

  readonly saveEntity = this.effect<T>((entity$) =>
    entity$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap((entity) =>
        this.saveEntity$(entity).pipe(
          tap((updated: T) =>
            this.patchState({ entity: updated, saveable: false })
          ),
          catchError((err) => {
            this.patchState({ error: err.message });
            return of(null);
          }),
          finalize(() => this.patchState({ loading: false }))
        )
      )
    )
  );

  readonly processEntity = this.effect<T>((entity$) =>
    entity$.pipe(
      tap(() => this.patchState({ processing: true, error: null })),
      switchMap((entity) =>
        this.processEntity$(entity).pipe(
          tap((processed: T) =>
            this.patchState({ entity: processed, saveable: true })
          ),
          catchError((err) => {
            this.patchState({ error: err.message });
            return of(null);
          }),
          finalize(() => this.patchState({ processing: false }))
        )
      )
    )
  );

  readonly updateSaveable = this.updater<T>((state, currentValue) => {
    const changed =
      JSON.stringify(state.entity) !== JSON.stringify(currentValue);
    return { ...state, saveable: changed };
  });
}
