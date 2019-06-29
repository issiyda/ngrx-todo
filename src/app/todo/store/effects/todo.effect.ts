import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, tap, concatMap, switchMap, catchError } from 'rxjs/operators';

import { TodoService } from '../../services';
import {
  TodoCreateDialogComponent,
  TodoDeleteDialogComponent,
  TodoEditDialogComponent
} from '../../components';
import * as TodoActions from '../actions';

/**
 * Todo effects
 */
@Injectable()
export class TodoEffects {
  createDialogRef: MatDialogRef<TodoCreateDialogComponent>;
  editDialogRef: MatDialogRef<TodoEditDialogComponent>;
  removeDialogRef: MatDialogRef<TodoDeleteDialogComponent>;

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private todoService: TodoService
  ) {}

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadAll),
      switchMap(({ offset, limit }) => {
        return this.todoService.findAll(offset, limit).pipe(
          map(result => TodoActions.loadAllSuccess({ todos: result })),
          catchError(error => of(TodoActions.loadAllFailure({ error })))
        );
      })
    )
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.load),
      concatMap(({ id }) => {
        return this.todoService.find(id).pipe(
          map(result => TodoActions.loadSuccess({ todo: result })),
          catchError(error => of(TodoActions.loadFailure({ error })))
        );
      })
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.create),
      concatMap(({ todo }) => {
        return this.todoService.create(todo).pipe(
          map(result => TodoActions.createSuccess({ todo: result })),
          catchError(error => of(TodoActions.createFailure({ error })))
        );
      })
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.update),
      concatMap(({ todo }) => {
        return this.todoService.update(todo).pipe(
          map(result => TodoActions.updateSuccess({ todo: result })),
          catchError(error => of(TodoActions.updateFailure({ error })))
        );
      })
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.remove),
      concatMap(({ id }) => {
        return this.todoService.remove(id).pipe(
          map(() => TodoActions.removeSuccess({ id })),
          catchError(error => of(TodoActions.removeFailure({ error })))
        );
      })
    )
  );

  showCreateDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.showCreateDialog),
        tap(() => {
          this.createDialogRef = this.dialog.open(TodoCreateDialogComponent, {
            width: '400px'
          });
        })
      ),
    { dispatch: false }
  );

  hideCreateDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.createSuccess),
        tap(() => {
          this.createDialogRef.close();
        })
      ),
    { dispatch: false }
  );

  showEditDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.showEditDialog),
        tap(({ todo }) => {
          this.editDialogRef = this.dialog.open(TodoEditDialogComponent, {
            width: '400px',
            data: { todo }
          });
        })
      ),
    { dispatch: false }
  );

  hideEditDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.updateSuccess),
        tap(() => {
          this.editDialogRef.close();
        })
      ),
    { dispatch: false }
  );

  showRemoveDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.showRemoveDialog),
        tap(({ id }) => {
          this.removeDialogRef = this.dialog.open(TodoDeleteDialogComponent, {
            data: { id }
          });
        })
      ),
    { dispatch: false }
  );

  hideRemoveDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.removeSuccess),
        tap(() => {
          this.removeDialogRef.close();
        })
      ),
    { dispatch: false }
  );
}
