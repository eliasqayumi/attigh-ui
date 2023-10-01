import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyStaticsComponent } from './currency-statics.component';

describe('CurrencyStaticsComponent', () => {
  let component: CurrencyStaticsComponent;
  let fixture: ComponentFixture<CurrencyStaticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyStaticsComponent]
    });
    fixture = TestBed.createComponent(CurrencyStaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
