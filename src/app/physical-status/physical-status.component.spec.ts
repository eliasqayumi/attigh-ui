import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalStatusComponent } from './physical-status.component';

describe('PhysicalStatusComponent', () => {
  let component: PhysicalStatusComponent;
  let fixture: ComponentFixture<PhysicalStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalStatusComponent]
    });
    fixture = TestBed.createComponent(PhysicalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
