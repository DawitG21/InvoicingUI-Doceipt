import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerGroupComponent } from './add-customer-group.component';

describe('AddCustomerGroupComponent', () => {
  let component: AddCustomerGroupComponent;
  let fixture: ComponentFixture<AddCustomerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
