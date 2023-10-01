import {Injectable} from '@angular/core';
import {environment} from "../environment/enviroment";
import {Project} from "../model/project";
import {BehaviorSubject, catchError, concatMap, map, merge, Observable, of, takeLast, tap, throwError} from "rxjs";
import {Action} from "../shared/action";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private host: string = environment.apiUrl + 'project'

  private emptyProject!: Project;
  private projectModifiedSubject: BehaviorSubject<Action<Project>> = new BehaviorSubject<Action<Project>>({
    item: this.emptyProject,
    action: 'none',
  });
  private projectSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  private projectsAction$: Observable<Project[]> = this.projectSubject.asObservable();
  private projectModifiedAction$: Observable<Action<Project>> = this.projectModifiedSubject.asObservable();
  private projects$: Observable<Project[]> = this.http.get<Project[]>(`${this.host}`).pipe(
    tap((project: Project[]) => this.projectSubject.next(project)),
    catchError(this.handleError));

  constructor(
    private http: HttpClient,
  ) {
  }

  projectWithCRUD$: Observable<Project[]> = merge(
    this.projectsAction$,
    this.projectModifiedAction$.pipe(
      concatMap((operation: Action<Project>) => this.saveProject(operation)),
      concatMap(() => this.projects$),
      takeLast(1)
    )
  );

  private headers: HttpHeaders = new HttpHeaders({'Content-Project': 'application/json'});

  private saveProject(operation: Action<Project>): Observable<Action<Project>> {
    const project = operation.item;
    if (operation.action === 'add') {
      return this.http
        .post<Project>(this.host, {...project, id: null}, {headers: this.headers})
        .pipe(
          map((project) => ({item: project, action: operation.action})),
          catchError(this.handleError)
        );
    }
    if (operation.action === 'delete') {
      const url = `${this.host}/${project.id}`;
      return this.http.delete<Project>(url, {headers: this.headers}).pipe(
        map(() => ({item: project, action: operation.action})),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      const url = `${this.host}/${project.id}`;
      return this.http.put<Project>(url, project, {headers: this.headers}).pipe(
        map(() => ({item: project, action: operation.action})),
        catchError(this.handleError)
      );
    }
    return of(operation);
  }


  addProject(newProject: Project): void {
    const project: Project = {
      projectName: newProject.projectName,
      projectCode: newProject.projectCode,
      type: newProject.type,
      implementationType: newProject.implementationType,
      id: newProject.id,
    } as Project;
    this.projectModifiedSubject.next({
      item: project,
      action: 'add',
    });
  }

  updateProject(project: Project): void {
    // Update a copy of the selected Project
    const updatedProject = {
      projectName: project.projectName,
      projectCode: project.projectCode,
      type: project.type,
      implementationType: project.implementationType,
      id: project.id,
    } as Project;
    this.projectModifiedSubject.next({
      item: updatedProject,
      action: 'update',
    });
  }

  deleteProject(selectedProject: Project): void {
    // Update a copy of the selected Project
    const deleteProject = {
      ...selectedProject,
    } as Project;
    this.projectModifiedSubject.next({
      item: deleteProject,
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
