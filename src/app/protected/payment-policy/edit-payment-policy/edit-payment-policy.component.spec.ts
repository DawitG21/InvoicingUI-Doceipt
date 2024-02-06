import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentPolicyComponent } from './edit-payment-policy.component';

describe('EditPaymentPolicyComponent', () => {
  let component: EditPaymentPolicyComponent;
  let fixture: ComponentFixture<EditPaymentPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPaymentPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
