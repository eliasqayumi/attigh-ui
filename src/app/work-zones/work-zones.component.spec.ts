import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkZonesComponent } from './work-zones.component';

describe('WorkZonesComponent', () => {
  let component: WorkZonesComponent;
  let fixture: ComponentFixture<WorkZonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkZonesComponent]
    });
    fixture = TestBed.createComponent(WorkZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
