import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {Type} from "../model/type";
import {BehaviorSubject, catchError, concatMap, map, merge, Observable, of, takeLast, tap, throwError} from "rxjs";
import {Action} from "../shared/action";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  private host: string = environment.apiUrl + 'type'

  private emptyType!: Type;
  private typeModifiedSubject: BehaviorSubject<Action<Type>> = new BehaviorSubject<Action<Type>>({
    item: this.emptyType,
    action: 'none',
  });
  private typeSubject: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([]);
  private typesAction$: Observable<Type[]> = this.typeSubject.asObservable();
  private typeModifiedAction$: Observable<Action<Type>> = this.typeModifiedSubject.asObservable();
  private types$: Observable<Type[]> = this.http.get<Type[]>(`${this.host}`).pipe(
    tap((type: Type[]) => this.typeSubject.next(type)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
  ) {
  }

  typeWithCRUD$: Observable<Type[]> = merge(
    this.typesAction$,
    this.typeModifiedAction$.pipe(
      concatMap((operation: Action<Type>) => this.saveType(operation)),
      concatMap(() => this.types$),
      takeLast(1)
    )
  );

  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private saveType(operation: Action<Type>): Observable<Action<Type>> {
    const type = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<Type>(this.host, {...type, id: null}, {headers: this.headers})
        .pipe(
          map((type) => ({item: type, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${type.id}`;
      return this.http.delete<Type>(url, {headers: this.headers}).pipe(
        map(() => ({item: type, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${type.id}`;
      return this.http.put<Type>(url, type, {headers: this.headers}).pipe(
        map(() => ({item: type, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addType(newType: Type): void {
    const type: Type = {
      projectType: newType.projectType,
      id: newType.id,
    } as Type;
    this.typeModifiedSubject.next({
      item: type,
      action: 'add',
    });
  }

  updateType(type: Type): void {
    // Update a copy of the selected Type
    const updatedType = {
      projectType: type.projectType,
      id: type.id,
    } as Type;
    this.typeModifiedSubject.next({
      item: updatedType,
      action: 'update',
    });
  }

  deleteType(selectedType: Type): void {
    // Update a copy of the selected Type
    const deleteType = {
      ...selectedType,
    } as Type;
    this.typeModifiedSubject.next({
      item: deleteType,
      action: 'delete',
    });
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
