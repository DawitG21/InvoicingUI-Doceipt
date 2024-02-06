import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressDialogComponent } from './billing-address-dialog.component';

describe('BillingAddressDialogComponent', () => {
  let component: BillingAddressDialogComponent;
  let fixture: ComponentFixture<BillingAddressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingAddressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
