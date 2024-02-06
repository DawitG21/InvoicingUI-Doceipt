import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCarouselComponent } from './invoice-carousel.component';

describe('InvoiceCarouselComponent', () => {
  let component: InvoiceCarouselComponent;
  let fixture: ComponentFixture<InvoiceCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
