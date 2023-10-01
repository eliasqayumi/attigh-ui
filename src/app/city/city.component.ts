import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CityService} from "../service/city.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, EMPTY} from "rxjs";
import {getDismissReason} from "../shared/shared"

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityComponent implements OnInit {
  closeResult = '';
  public formGroup!: FormGroup;
  public FORM_NAME = {
    ID: 'id',
    CITY_NAME: 'cityName',
    CITY_CODE: 'cityCode'
  }
  public errorMessage!: string;

  constructor(
    private modalService: NgbModal,
    private readonly cityService: CityService,
    private readonly fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      [this.FORM_NAME.ID]: [null],
      [this.FORM_NAME.CITY_NAME]: [null, [Validators.required]],
      [this.FORM_NAME.CITY_CODE]: [null, [Validators.required, Validators.max(100), Validators.min(1)]]
    })
  }

  cities$ = this.cityService.cityWithCRUD$.pipe(
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    })
  );

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


  onSubmit(): void {
    this.cityService.addCity(this.formGroup.value);
  }

  onDeleter(): void {
    this.cityService.deleteCity(this.formGroup.value);
  }

  onUpdate(): void {
    this.cityService.updateCity(this.formGroup.value);
  }

}
