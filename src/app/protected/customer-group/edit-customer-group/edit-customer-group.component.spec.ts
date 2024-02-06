import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerGroupComponent } from './edit-customer-group.component';

describe('EditCustomerGroupComponent', () => {
  let component: EditCustomerGroupComponent;
  let fixture: ComponentFixture<EditCustomerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
