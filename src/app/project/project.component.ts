import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TypeService} from "../service/type.service";
import {ImplementationTypeService} from "../service/implementation-type.service";
import {ProjectService} from "../service/project.service";
import {catchError, combineLatest, EMPTY, filter, flatMap, map, Observable, Subject, tap} from "rxjs";
import {Type} from "../model/type";
import {ImplementationType} from "../model/implementation-type";
import {getDismissReason} from "../shared/shared";
import {Project} from "../model/project";
import {Etude} from "../model/etude";
import {Planning} from "../model/planning";
import {PlanningService} from "../service/planning.service";
import {DistrictService} from "../service/district.service";
import {District} from "../model/district";
import {EtudeService} from "../service/etude.service";
import {SelectedProject} from "../shared/selectedProject";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit {
  public errorMessage!: string;
  public formGroup!: FormGroup;
  closeResult = '';
  public selectedPlanning!: Planning;
  public selectedEtude!: Etude;

  constructor(
    private modalService: NgbModal,
    private readonly typeService: TypeService,
    private readonly implementationTypeService: ImplementationTypeService,
    private readonly projectService: ProjectService,
    private readonly planningService: PlanningService,
    private readonly districtService: DistrictService,
    private readonly etudeService: EtudeService,
    private readonly selectedProject: SelectedProject,
    private readonly fb: FormBuilder,
  ) {
  }

  public readonly type$: Observable<Type[]> = this.typeService.typeWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  }))

  public readonly districts$: Observable<District[]> = this.districtService.districtWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  }))

  public readonly implementationType$: Observable<ImplementationType[]> = this.implementationTypeService.implementationTypeWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY
  }))

  public readonly projects$: Observable<Project[]> = this.projectService.projectWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  }))

  public FORM_NAME = {
    ID: 'id',
    PROJECT_NAME: 'projectName',
    PROJECT_CODE: 'projectCode',
    TYPE: 'type',
    IMPLEMENTATION_TYPE: 'implementationType'
  }

  open(content: any): void {
    this.modalService.open(content, {size:'xl',ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${getDismissReason(reason)}`;
      },
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  readonly selectedProjectPlannings$: Observable<Planning[]> = this.planningService.selectedProjectPlannings$.pipe(
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    })
  )

  readonly selectedProjectEtudes$: Observable<Etude[]> = this.etudeService.selectedProjectEtudes$.pipe(catchError(error => {
    this.errorMessage = error;
    return EMPTY;
  }))

  initForm(): void {
    this.formGroup = this.fb.group({
      [this.FORM_NAME.ID]: [null],
      [this.FORM_NAME.PROJECT_NAME]: [null, [Validators.required]],
      [this.FORM_NAME.PROJECT_CODE]: [null, [Validators.required]],
      [this.FORM_NAME.TYPE]: [null, [Validators.required]],
      [this.FORM_NAME.IMPLEMENTATION_TYPE]: [null, [Validators.required]]
    })
  }

  onSubmit(): void {
    this.projectService.addProject(this.formGroup.value);
  }

  onUpdate(): void {
    this.projectService.updateProject(this.formGroup.value);
  }

  onDelete(): void {
    this.projectService.deleteProject(this.formGroup.value);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onAddPlanning(planning: Planning):
    void {
    this.selectedPlanning = planning;
    planning.project = this.formGroup.value;
    this.planningService.addPlanning(planning);
  }

  onAddEtude(etude: Etude): void {
    etude.project = this.formGroup.value;
    this.etudeService.addEtude(etude);
  }

  onSelect(project: Project): void {
    this.selectedProject.onProjectSelect(project)
    this.formGroup.setValue(project);
  }
}
