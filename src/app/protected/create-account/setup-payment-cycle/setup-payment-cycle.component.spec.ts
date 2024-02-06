import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPaymentCycleComponent } from './setup-payment-cycle.component';

describe('SetupPaymentCycleComponent', () => {
  let component: SetupPaymentCycleComponent;
  let fixture: ComponentFixture<SetupPaymentCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPaymentCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPaymentCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
