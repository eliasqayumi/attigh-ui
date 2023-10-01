import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {Project} from "../model/project";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {District} from "../model/district";
import {Planning} from "../model/planning";
import {PlanningService} from "../service/planning.service";
import {catchError, EMPTY, Observable, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit {
  @Output() planning: EventEmitter<Planning> = new EventEmitter<Planning>();
  @Input() districts!: District[] | null;
  public errorMessage!: string;
  public formGroup!: FormGroup;
  public FORM_NAME = {
    ID: 'id',
    PROJECT: 'project',
    DISTRICT: 'district',
    AREA: 'area'
  }

  ngOnInit(): void {
    this.initForm()
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly planningService: PlanningService,
    private readonly ref: ChangeDetectorRef
  ) {
  }

  readonly selectedProjectPlannings$: Observable<Planning[]> = this.planningService.selectedProjectPlannings$.pipe(
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    })
  )

  initForm(): void {
    this.formGroup = this.fb.group({
      [this.FORM_NAME.ID]: [null],
      [this.FORM_NAME.PROJECT]: [null],
      [this.FORM_NAME.DISTRICT]: [null, [Validators.required]],
      [this.FORM_NAME.AREA]: [null, [Validators.required]]
    })
  }

  onSubmit(): void {
    this.planning.emit(this.formGroup.value)
    this.formGroup.reset();
  }
}
