import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSearchPageComponent } from './invoice-search-page.component';

describe('InvoiceSearchPageComponent', () => {
  let component: InvoiceSearchPageComponent;
  let fixture: ComponentFixture<InvoiceSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
