import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, EMPTY, Observable} from "rxjs";
import {getDismissReason} from "../shared/shared";
import {TypeService} from "../service/type.service";
import {ImplementationTypeService} from "../service/implementation-type.service";
import {ProjectService} from "../service/project.service";
import {ImplementationType} from "../model/implementation-type";
import {Type} from "../model/type";

@Component({
  selector: 'app-physical-tasks',
  templateUrl: './physical-tasks.component.html',
  styleUrls: ['./physical-tasks.component.scss']
})
export class PhysicalTasksComponent{
}
