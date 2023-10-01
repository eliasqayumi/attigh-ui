import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {Project} from "../model/project";

@Injectable({
  providedIn: 'root'
})
export class SelectedProject{
  private projectSelectSubject: Subject<Project> = new Subject<Project>();
  public projectSelectAction$: Observable<Project> = this.projectSelectSubject.asObservable();

  onProjectSelect(project: Project): void {
    this.projectSelectSubject.next(project);
  }
}
