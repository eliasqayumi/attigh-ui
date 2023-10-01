import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, EMPTY, Observable} from "rxjs";
import {Neighbourhood} from "../model/neighbourhood";
import {NeighbourhoodService} from "../service/neighbourhood.service";
import {EtudeService} from "../service/etude.service";
import {Etude} from "../model/etude";

@Component({
  selector: 'app-etude',
  templateUrl: './etude.component.html',
  styleUrls: ['./etude.component.scss']
})
export class EtudeComponent implements OnInit {
  @Output() etude: EventEmitter<Etude> = new EventEmitter<Etude>();
  public errorMessage!: string;
  public formGroup!: FormGroup;
  public FORM_NAME = {
    ID: 'id',
    PROJECT: 'project',
    NEIGHBOURHOOD: 'neighbourhood',
    REGULATION_AREA: 'regulationArea',
    NUMBER_OF_BLOCK: 'numberOfBlock',
    NUMBER_OF_BUSINESS: 'numberOfBusiness',
    CAD_NUMBER_OF_PARCELS: 'cadNumberOfParcels',
    WAY: 'way'
  }

  ngOnInit(): void {
    this.initForm()
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly etudeService: EtudeService,
    private readonly neighbourhoodService: NeighbourhoodService
  ) {
  }

  readonly selectedProjectEtudes$: Observable<Etude[]> = this.etudeService.selectedProjectEtudes$.pipe(
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    })
  )
  readonly neighbourhoods$: Observable<Neighbourhood[]> = this.neighbourhoodService.neighbourhoodWithCRUD$.pipe(catchError(error => {
    this.errorMessage = error;
    return EMPTY;
  }))

  initForm(): void {
    this.formGroup = this.fb.group({
      [this.FORM_NAME.ID]: [null],
      [this.FORM_NAME.PROJECT]: [null],
      [this.FORM_NAME.NEIGHBOURHOOD]: [null, [Validators.required]],
      [this.FORM_NAME.REGULATION_AREA]: [null, [Validators.required]],
      [this.FORM_NAME.NUMBER_OF_BLOCK]: [null, [Validators.required]],
      [this.FORM_NAME.NUMBER_OF_BUSINESS]: [null, [Validators.required]],
      [this.FORM_NAME.CAD_NUMBER_OF_PARCELS]: [null, [Validators.required]],
      [this.FORM_NAME.WAY]: [null, [Validators.required]]
    })
  }

  onSubmit(): void {
    this.etude.emit(this.formGroup.value)
    this.formGroup.reset();
  }
}
