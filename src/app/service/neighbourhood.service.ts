import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {Neighbourhood} from "../model/neighbourhood";
import {BehaviorSubject, catchError, concatMap, map, merge, Observable, of, takeLast, tap, throwError} from "rxjs";
import {Action} from "../shared/action";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NeighbourhoodService {

  private host: string = environment.apiUrl + 'neighbourhood'

  private emptyNeighbourhood!: Neighbourhood;
  private neighbourhoodModifiedSubject: BehaviorSubject<Action<Neighbourhood>> = new BehaviorSubject<Action<Neighbourhood>>({
    item: this.emptyNeighbourhood,
    action: 'none',
  });

  private neighbourhoodSubject: BehaviorSubject<Neighbourhood[]> = new BehaviorSubject<Neighbourhood[]>([]);

  private neighbourhoodsAction$: Observable<Neighbourhood[]> = this.neighbourhoodSubject.asObservable();

  private neighbourhoodModifiedAction$: Observable<Action<Neighbourhood>> = this.neighbourhoodModifiedSubject.asObservable();

  private neighbourhoods$: Observable<Neighbourhood[]> = this.http.get<Neighbourhood[]>(`${this.host}`).pipe(
    tap((neighbourhood: Neighbourhood[]) => this.neighbourhoodSubject.next(neighbourhood)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
  ) {
  }

  neighbourhoodWithCRUD$: Observable<Neighbourhood[]> = merge(
    this.neighbourhoodsAction$,
    this.neighbourhoodModifiedAction$.pipe(
      concatMap((operation: Action<Neighbourhood>) => this.saveNeighbourhood(operation)),
      concatMap(() => this.neighbourhoods$),
      takeLast(1)
    )
  );

  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private saveNeighbourhood(operation: Action<Neighbourhood>): Observable<Action<Neighbourhood>> {
    const neighbourhood: Neighbourhood = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<Neighbourhood>(this.host, {...neighbourhood, id: null}, {headers: this.headers})
        .pipe(
          map((neighbourhood) => ({item: neighbourhood, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${neighbourhood.id}`;
      return this.http.delete<Neighbourhood>(url, {headers: this.headers}).pipe(
        map(() => ({item: neighbourhood, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${neighbourhood.id}`;
      return this.http.put<Neighbourhood>(url, neighbourhood, {headers: this.headers}).pipe(
        map(() => ({item: neighbourhood, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addNeighbourhood(newNeighbourhood: Neighbourhood): void {
    const neighbourhood: Neighbourhood = {
      district: newNeighbourhood.district,
      neighbourhoodName: newNeighbourhood.neighbourhoodName,
      id: newNeighbourhood.id,
    } as Neighbourhood;
    this.neighbourhoodModifiedSubject.next({
      item: neighbourhood,
      action: 'add',
    });
  }

  updateNeighbourhood(neighbourhood: Neighbourhood): void {
    // Update a copy of the selected Neighbourhood
    const updatedNeighbourhood: Neighbourhood = {
      district: neighbourhood.district,
      neighbourhoodName: neighbourhood.neighbourhoodName,
      id: neighbourhood.id,
    } as Neighbourhood;
    this.neighbourhoodModifiedSubject.next({
      item: updatedNeighbourhood,
      action: 'update',
    });
  }

  deleteNeighbourhood(selectedNeighbourhood: Neighbourhood): void {
    // Update a copy of the selected Neighbourhood
    const deleteNeighbourhood: Neighbourhood = {
      ...selectedNeighbourhood,
    } as Neighbourhood;
    this.neighbourhoodModifiedSubject.next({
      item: deleteNeighbourhood,
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
