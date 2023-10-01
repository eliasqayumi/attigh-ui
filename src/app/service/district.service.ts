import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {District} from "../model/district";
import {BehaviorSubject, catchError, concatMap, map, merge, Observable, of, takeLast, tap, throwError} from "rxjs";
import {Action} from "../shared/action";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private host: string = environment.apiUrl + 'district'
  private emptyDistrict!: District;

  private districtModifiedSubject: BehaviorSubject<Action<District>> = new BehaviorSubject<Action<District>>({
    item: this.emptyDistrict,
    action: 'none',
  });

  private districtSubject: BehaviorSubject<District[]> = new BehaviorSubject<District[]>([]);

  private districtsAction$: Observable<District[]> = this.districtSubject.asObservable();

  private districtModifiedAction$: Observable<Action<District>> = this.districtModifiedSubject.asObservable();

  private districts$: Observable<District[]> = this.http.get<District[]>(`${this.host}`).pipe(
    tap((district: District[]) => this.districtSubject.next(district)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
  ) {
  }

  districtWithCRUD$: Observable<District[]> = merge(
    this.districtsAction$,
    this.districtModifiedAction$.pipe(
      concatMap((operation: Action<District>) => this.saveDistrict(operation)),
      concatMap(() => this.districts$),
      takeLast(1)
    )
  );

  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private saveDistrict(operation: Action<District>): Observable<Action<District>> {
    const district = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<District>(this.host, {...district, id: null}, {headers: this.headers})
        .pipe(
          map((district) => ({item: district, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${district.id}`;
      return this.http.delete<District>(url, {headers: this.headers}).pipe(
        map(() => ({item: district, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${district.id}`;
      return this.http.put<District>(url, district, {headers: this.headers}).pipe(
        map(() => ({item: district, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addDistrict(newDistrict: District): void {
    const district = {
      city: newDistrict.city,
      districtName: newDistrict.districtName,
      id: newDistrict.id,
    } as District;
    this.districtModifiedSubject.next({
      item: district,
      action: 'add',
    });
  }

  updateDistrict(district: District): void {
    // Update a copy of the selected District
    const updatedDistrict = {
      city: district.city,
      districtName: district.districtName,
      id: district.id,
    } as District;
    this.districtModifiedSubject.next({
      item: updatedDistrict,
      action: 'update',
    });
  }

  deleteDistrict(selectedDistrict: District): void {
    // Update a copy of the selected District
    const deleteDistrict = {
      ...selectedDistrict,
    } as District;
    this.districtModifiedSubject.next({
      item: deleteDistrict,
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
