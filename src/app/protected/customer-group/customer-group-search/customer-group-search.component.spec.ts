import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupSearchComponent } from './customer-group-search.component';

describe('CustomerGroupSearchComponent', () => {
  let component: CustomerGroupSearchComponent;
  let fixture: ComponentFixture<CustomerGroupSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
