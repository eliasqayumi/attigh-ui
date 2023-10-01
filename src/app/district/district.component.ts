import {Component, OnInit} from '@angular/core';
import {CityService} from "../service/city.service";
import {catchError, EMPTY, Observable} from "rxjs";
import {City} from "../model/city";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {getDismissReason} from "../shared/shared";
import {DistrictService} from "../service/district.service";
import {District} from "../model/district";

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit {
  public errorMessage!: string;
  public formGroup!: FormGroup;
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private readonly cityService: CityService,
    private readonly districtService: DistrictService,
    private readonly fb: FormBuilder) {
  }

  public readonly cities$: Observable<City[]> = this.cityService.cityWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY
  }))

  public readonly districts$: Observable<District[]> = this.districtService.districtWithCRUD$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  }))
  public FORM_NAME = {
    ID: 'id',
    DISTRICT_NAME: 'districtName',
    CITY: 'city'
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
      [this.FORM_NAME.CITY]: [null, [Validators.required]],
      [this.FORM_NAME.DISTRICT_NAME]: [null, [Validators.required]]
    })
  }

  onSubmit(): void {
    this.districtService.addDistrict(this.formGroup.value);
  }

  onUpdate(): void {
    this.districtService.updateDistrict(this.formGroup.value);
  }

  onDelete(): void {
    this.districtService.deleteDistrict(this.formGroup.value);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
