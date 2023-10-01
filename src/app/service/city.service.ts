import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, concatMap, map, merge, Observable, of, takeLast, tap, throwError} from "rxjs";
import {City} from "../model/city";
import {environment} from "../environment/enviroment";
import {Action} from "../shared/action";

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private host: string = environment.apiUrl + 'city'

  private emptyCity!: City;
  // ilk dger atama
  private cityModifiedSubject: BehaviorSubject<Action<City>> = new BehaviorSubject<Action<City>>({
    item: this.emptyCity,
    action: 'none',
  });

  private citySubject: BehaviorSubject<City[]> = new BehaviorSubject<City[]>([]);

  citiesAction$: Observable<City[]> = this.citySubject.asObservable();

  cityModifiedAction$: Observable<Action<City>> = this.cityModifiedSubject.asObservable();

  private cities$: Observable<City[]> = this.http.get<City[]>(`${this.host}`).pipe(
    tap((city: City[]) => this.citySubject.next(city)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
  ) {
  }

  cityWithCRUD$: Observable<City[]> = merge(
    this.citiesAction$,
    this.cityModifiedAction$.pipe(
      concatMap((operation: Action<City>) => this.saveCity(operation)),
      concatMap(() => this.cities$),
      takeLast(1)
    )
  );

  headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  saveCity(operation: Action<City>): Observable<Action<City>> {
    const city = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<City>(this.host, {...city, id: null}, {headers: this.headers})
        .pipe(
          map((city) => ({item: city, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${city.id}`;
      return this.http.delete<City>(url, {headers: this.headers}).pipe(
        map(() => ({item: city, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${city.id}`;
      return this.http.put<City>(url, city, {headers: this.headers}).pipe(
        map(() => ({item: city, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addCity(newCity: City): void {
    const city = {
      cityCode: newCity.cityCode,
      cityName: newCity.cityName,
      id: newCity.id,
    } as City;
    this.cityModifiedSubject.next({
      item: city,
      action: 'add',
    });
  }

  updateCity(city: City): void {
    // Update a copy of the selected City
    const updatedCity = {
      cityCode: city.cityCode,
      cityName: city.cityName,
      id: city.id,
    } as City;
    this.cityModifiedSubject.next({
      item: updatedCity,
      action: 'update',
    });
  }

  deleteCity(selectedCity: City): void {
    // Update a copy of the selected City
    const deleteCity = {
      ...selectedCity,
    } as City;
    this.cityModifiedSubject.next({
      item: deleteCity,
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
