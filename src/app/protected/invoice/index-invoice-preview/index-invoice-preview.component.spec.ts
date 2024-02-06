import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexInvoicePreviewComponent } from './index-invoice-preview.component';

describe('IndexInvoicePreviewComponent', () => {
  let component: IndexInvoicePreviewComponent;
  let fixture: ComponentFixture<IndexInvoicePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexInvoicePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexInvoicePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
