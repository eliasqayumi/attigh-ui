import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingConstructionComponent } from './building-construction.component';

describe('BuildingConstructionComponent', () => {
  let component: BuildingConstructionComponent;
  let fixture: ComponentFixture<BuildingConstructionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingConstructionComponent]
    });
    fixture = TestBed.createComponent(BuildingConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
