import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudeComponent } from './etude.component';

describe('EtudeComponent', () => {
  let component: EtudeComponent;
  let fixture: ComponentFixture<EtudeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtudeComponent]
    });
    fixture = TestBed.createComponent(EtudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
