import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchInvoiceCreateDialogComponent } from './batch-invoice-create-dialog.component';

describe('BatchInvoiceCreateDialogComponent', () => {
  let component: BatchInvoiceCreateDialogComponent;
  let fixture: ComponentFixture<BatchInvoiceCreateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchInvoiceCreateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInvoiceCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
