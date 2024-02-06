import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaymentCycleComponent } from './update-payment-cycle.component';

describe('UpdatePaymentCycleComponent', () => {
  let component: UpdatePaymentCycleComponent;
  let fixture: ComponentFixture<UpdatePaymentCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePaymentCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePaymentCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
