import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePageComponent} from './home-page/home-page.component';
import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModule, NgbPopoverModule, NgbRatingModule,
  NgbToastModule
} from '@ng-bootstrap/ng-bootstrap';
import {MainPageComponent} from './main-page/main-page.component';
import {PhysicalStatusComponent} from './physical-status/physical-status.component';
import {CurrencyStaticsComponent} from './currency-statics/currency-statics.component';
import {OthersComponent} from './others/others.component';
import {WorkZonesComponent} from './work-zones/work-zones.component';
import {CityComponent} from './city/city.component';
import {DistrictComponent} from './district/district.component';
import {NeighbourhoodComponent} from './neighbourhood/neighbourhood.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {PhysicalTasksComponent} from './physical-tasks/physical-tasks.component';
import {ProjectComponent} from './project/project.component';
import {CommonModule, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSortModule} from "@angular/material/sort";
import {PlanningComponent} from './planning/planning.component';
import {EtudeComponent} from './etude/etude.component';
import {BuildingConstructionComponent} from './building-construction/building-construction.component';
import {PlanningListComponent} from './planning-list/planning-list.component';
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MainPageComponent,
    PhysicalStatusComponent,
    CurrencyStaticsComponent,
    OthersComponent,
    WorkZonesComponent,
    CityComponent,
    DistrictComponent,
    NeighbourhoodComponent,
    PhysicalTasksComponent,
    ProjectComponent,
    PlanningComponent,
    EtudeComponent,
    BuildingConstructionComponent,
    PlanningListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbAlertModule,
    ReactiveFormsModule,
    HammerModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule, NgbDropdownModule,
    MatIconModule, NgbCarouselModule,
    NgbToastModule, NgIf, NgbPopoverModule,
    NgbRatingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
