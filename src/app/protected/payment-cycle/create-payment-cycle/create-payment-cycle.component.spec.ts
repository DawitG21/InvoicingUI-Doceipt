import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentCycleComponent } from './create-payment-cycle.component';

describe('CreatePaymentCycleComponent', () => {
  let component: CreatePaymentCycleComponent;
  let fixture: ComponentFixture<CreatePaymentCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePaymentCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
