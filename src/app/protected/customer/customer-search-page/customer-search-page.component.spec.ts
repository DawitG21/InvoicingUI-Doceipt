import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchPageComponent } from './customer-search-page.component';

describe('CustomerSearchPageComponent', () => {
  let component: CustomerSearchPageComponent;
  let fixture: ComponentFixture<CustomerSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
