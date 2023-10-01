import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalTasksComponent } from './physical-tasks.component';

describe('PhysicalTasksComponent', () => {
  let component: PhysicalTasksComponent;
  let fixture: ComponentFixture<PhysicalTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalTasksComponent]
    });
    fixture = TestBed.createComponent(PhysicalTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
