import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentPolicyComponent } from './add-payment-policy.component';

describe('AddPaymentPolicyComponent', () => {
  let component: AddPaymentPolicyComponent;
  let fixture: ComponentFixture<AddPaymentPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
