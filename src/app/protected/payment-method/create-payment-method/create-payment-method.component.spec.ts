import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentMethodComponent } from './create-payment-method.component';

describe('CreatePaymentMethodComponent', () => {
  let component: CreatePaymentMethodComponent;
  let fixture: ComponentFixture<CreatePaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
