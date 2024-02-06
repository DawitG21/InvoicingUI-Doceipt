import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDueInvoiceComponent } from './customer-dueInvoice.component';

describe('CustomerDueInvoiceComponent', () => {
  let component: CustomerDueInvoiceComponent;
  let fixture: ComponentFixture<CustomerDueInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDueInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDueInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
