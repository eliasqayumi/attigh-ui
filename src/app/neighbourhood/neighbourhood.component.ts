import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, EMPTY, Observable} from "rxjs";
import {getDismissReason} from "../shared/shared";
import {NeighbourhoodService} from "../service/neighbourhood.service";
import {Neighbourhood} from "../model/neighbourhood";
import {DistrictService} from "../service/district.service";
import {District} from "../model/district";

@Component({
  selector: 'app-neighbourhood',
  templateUrl: './neighbourhood.component.html',
  styleUrls: ['./neighbourhood.component.scss']
})
export class NeighbourhoodComponent implements OnInit {
  public errorMessage!: string;
  public formGroup!: FormGroup;
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private readonly districtService: DistrictService,
    private readonly neighbourhoodService: NeighbourhoodService,
    private readonly fb: FormBuilder) {
  }

  public readonly districts$: Observable<District[]> = this.districtService.districtWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  }))

  public readonly neighbourhoods$: Observable<Neighbourhood[]> = this.neighbourhoodService.neighbourhoodWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY
  }))

  public FORM_NAME = {
    ID: 'id',
    NEIGHBOURHOOD_NAME: 'neighbourhoodName',
    DISTRICT: 'district'
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
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

  initForm(): void {
    this.formGroup = this.fb.group({
      [this.FORM_NAME.ID]: [null],
      [this.FORM_NAME.DISTRICT]: [null, [Validators.required]],
      [this.FORM_NAME.NEIGHBOURHOOD_NAME]: [null, [Validators.required]]
    })
  }

  onSubmit(): void {
    this.neighbourhoodService.addNeighbourhood(this.formGroup.value);
  }

  onUpdate(): void {
    this.neighbourhoodService.updateNeighbourhood(this.formGroup.value);
  }

  onDelete(): void {
    this.neighbourhoodService.deleteNeighbourhood(this.formGroup.value);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
