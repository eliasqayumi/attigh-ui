import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {Planning} from "../model/planning";
import {
  BehaviorSubject,
  catchError, combineLatest,
  concatMap,
  map,
  merge,
  Observable,
  of, shareReplay,
  Subject,
  takeLast,
  tap,
  throwError
} from "rxjs";
import {Action} from "../shared/action";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Project} from "../model/project";
import {SelectedProject} from "../shared/selectedProject";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  private host: string = environment.apiUrl + 'planning'

  private emptyPlanning!: Planning;
  private planningModifiedSubject: BehaviorSubject<Action<Planning>> = new BehaviorSubject<Action<Planning>>({
    item: this.emptyPlanning,
    action: 'none',
  });
  private planningSubject: BehaviorSubject<Planning[]> = new BehaviorSubject<Planning[]>([]);
  private planningsAction$: Observable<Planning[]> = this.planningSubject.asObservable();
  private planningModifiedAction$: Observable<Action<Planning>> = this.planningModifiedSubject.asObservable();
  private plannings$: Observable<Planning[]> = this.http.get<Planning[]>(`${this.host}`).pipe(
    tap((planning: Planning[]) => this.planningSubject.next(planning)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
    private readonly selectedProject: SelectedProject
  ) {
  }

  planningWithCRUD$: Observable<Planning[]> = merge(
    this.planningsAction$,
    this.planningModifiedAction$.pipe(
      concatMap((operation: Action<Planning>) => this.savePlanning(operation)),
      concatMap(() => this.plannings$),
      takeLast(1)
    )
  );

  selectedProjectPlannings$: Observable<Planning[]> = combineLatest([this.selectedProject.projectSelectAction$, this.planningWithCRUD$])
    .pipe(
      map(([selectedProject, plannings]: [Project, Planning[]]) =>
        plannings.filter((planning: Planning): boolean => planning.project.id === selectedProject.id)
      ),
      shareReplay(1)
    );

  private headers: HttpHeaders = new HttpHeaders({'Content-Planning': 'application/json'});

  private savePlanning(operation: Action<Planning>): Observable<Action<Planning>> {
    const planning = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<Planning>(this.host,
          {...planning, id: null}, {headers: this.headers})
        .pipe(
          map((planning) => ({item: planning, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${planning.id}`;
      return this.http.delete<Planning>(url, {headers: this.headers}).pipe(
        map(() => ({item: planning, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${planning.id}`;
      return this.http.put<Planning>(url, planning, {headers: this.headers}).pipe(
        map(() => ({item: planning, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addPlanning(newPlanning: Planning): void {
    const planning: Planning = {
      project: newPlanning.project,
      district: newPlanning.district,
      area: newPlanning.area,
      id: newPlanning.id,
    } as Planning;
    this.planningModifiedSubject.next({
      item: planning,
      action: 'add',
    });
  }

  updatePlanning(planning: Planning): void {
    // Update a copy of the selected Planning
    const updatedPlanning: Planning = {
      project: planning.project,
      district: planning.district,
      area: planning.area,
      id: planning.id,
    } as Planning;
    this.planningModifiedSubject.next({
      item: updatedPlanning,
      action: 'update',
    });
  }

  deletePlanning(selectedPlanning: Planning): void {
    // Update a copy of the selected Planning
    const deletePlanning = {
      ...selectedPlanning,
    } as Planning;
    this.planningModifiedSubject.next({
      item: deletePlanning,
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
