import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {Etude} from "../model/etude";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concatMap,
  map,
  merge,
  Observable, of, shareReplay,
  takeLast,
  tap, throwError
} from "rxjs";
import {Action} from "../shared/action";
import {Project} from "../model/project";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {SelectedProject} from "../shared/selectedProject";

@Injectable({
  providedIn: 'root'
})
export class EtudeService {
  private host: string = environment.apiUrl + 'etude'

  private emptyetude!: Etude;
  private etudeModifiedSubject: BehaviorSubject<Action<Etude>> = new BehaviorSubject<Action<Etude>>({
    item: this.emptyetude,
    action: 'none',
  });
  private etudeSubject: BehaviorSubject<Etude[]> = new BehaviorSubject<Etude[]>([]);
  private etudesAction$: Observable<Etude[]> = this.etudeSubject.asObservable();
  private etudeModifiedAction$: Observable<Action<Etude>> = this.etudeModifiedSubject.asObservable();
  private etudes$: Observable<Etude[]> = this.http.get<Etude[]>(`${this.host}`).pipe(
    tap((etude: Etude[]) => this.etudeSubject.next(etude)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
    private readonly  selectedProject:SelectedProject
  ) {
  }

  etudeWithCRUD$: Observable<Etude[]> = merge(
    this.etudesAction$,
    this.etudeModifiedAction$.pipe(
      concatMap((operation: Action<Etude>) => this.saveetude(operation)),
      concatMap(() => this.etudes$),
      takeLast(1)
    )
  );

  selectedProjectEtudes$: Observable<Etude[]> = combineLatest([this.selectedProject.projectSelectAction$, this.etudeWithCRUD$])
    .pipe(
      map(([selectedProject, etudes]: [Project, Etude[]]) =>
        etudes.filter((etude: Etude): boolean => etude.project.id === selectedProject.id)
      ),
      shareReplay(1)
    );

  private headers: HttpHeaders = new HttpHeaders({'Content-Etude': 'application/json'});

  private saveetude(operation: Action<Etude>): Observable<Action<Etude>> {
    const etude = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<Etude>(this.host,
          {
            ...etude,
            projectId: etude.project.id,
            neighbourhoodId: etude.neighbourhood.id,
            id: null
          }, {headers: this.headers})
        .pipe(
          map((etude) => ({item: etude, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${etude.id}`;
      return this.http.delete<Etude>(url, {headers: this.headers}).pipe(
        map(() => ({item: etude, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${etude.id}`;
      return this.http.put<Etude>(url, etude, {headers: this.headers}).pipe(
        map(() => ({item: etude, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addEtude(etude: Etude): void {
    this.etudeModifiedSubject.next({
      item: etude,
      action: 'add',
    });
  }

  updateEtude(etude: Etude): void {
    // Update a copy of the selected Etude
    this.etudeModifiedSubject.next({
      item: etude,
      action: 'update',
    });
  }

  deleteEtude(selectedetude: Etude): void {
    // Update a copy of the selected Etude
    const deleteetude = {
      ...selectedetude,
    } as Etude;
    this.etudeModifiedSubject.next({
      item: deleteetude,
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
