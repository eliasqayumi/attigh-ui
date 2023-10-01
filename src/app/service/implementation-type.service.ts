import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {ImplementationType} from "../model/implementation-type";
import {BehaviorSubject, catchError, concatMap, map, merge, Observable, of, takeLast, tap, throwError} from "rxjs";
import {Action} from "../shared/action";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImplementationTypeService {

  private host: string = environment.apiUrl + 'implementationType'

  private emptyImplementationType!: ImplementationType;
  private ImplementationTypeModifiedSubject: BehaviorSubject<Action<ImplementationType>> = new BehaviorSubject<Action<ImplementationType>>({
    item: this.emptyImplementationType,
    action: 'none',
  });
  private ImplementationTypeSubject: BehaviorSubject<ImplementationType[]> = new BehaviorSubject<ImplementationType[]>([]);
  private ImplementationTypesAction$: Observable<ImplementationType[]> = this.ImplementationTypeSubject.asObservable();
  private ImplementationTypeModifiedAction$: Observable<Action<ImplementationType>> = this.ImplementationTypeModifiedSubject.asObservable();
  private ImplementationTypes$: Observable<ImplementationType[]> = this.http.get<ImplementationType[]>(`${this.host}`).pipe(
    tap((ImplementationType: ImplementationType[]) => this.ImplementationTypeSubject.next(ImplementationType)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
  ) {
  }

  implementationTypeWithCRUD$: Observable<ImplementationType[]> = merge(
    this.ImplementationTypesAction$,
    this.ImplementationTypeModifiedAction$.pipe(
      concatMap((operation: Action<ImplementationType>) => this.saveImplementationType(operation)),
      concatMap(() => this.ImplementationTypes$),
      takeLast(1)
    )
  );

  private headers: HttpHeaders = new HttpHeaders({'Content-ImplementationType': 'application/json'});

  private saveImplementationType(operation: Action<ImplementationType>): Observable<Action<ImplementationType>> {
    const ImplementationType = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<ImplementationType>(this.host, {...ImplementationType, id: null}, {headers: this.headers})
        .pipe(
          map((ImplementationType) => ({
            item: ImplementationType,
            action: operation.action
          })),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${ImplementationType.id}`;
      return this.http.delete<ImplementationType>(url, {headers: this.headers}).pipe(
        map(() => ({item: ImplementationType, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${ImplementationType.id}`;
      return this.http.put<ImplementationType>(url, ImplementationType, {headers: this.headers}).pipe(
        map(() => ({item: ImplementationType, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addImplementationType(newImplementationType: ImplementationType): void {
    const ImplementationType: ImplementationType = {
      implementationType: newImplementationType.implementationType,
      id: newImplementationType.id,
    } as ImplementationType;
    this.ImplementationTypeModifiedSubject.next({
      item: ImplementationType,
      action: 'add',
    });
  }

  updateImplementationType(ImplementationType: ImplementationType): void {
    // Update a copy of the selected ImplementationType
    const updatedImplementationType = {
      implementationType: ImplementationType.implementationType,
      id: ImplementationType.id,
    } as ImplementationType;
    this.ImplementationTypeModifiedSubject.next({
      item: updatedImplementationType,
      action: 'update',
    });
  }

  deleteImplementationType(selectedImplementationType: ImplementationType): void {
    // Update a copy of the selected ImplementationType
    const deleteImplementationType = {
      ...selectedImplementationType,
    } as ImplementationType;
    this.ImplementationTypeModifiedSubject.next({
      item: deleteImplementationType,
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
