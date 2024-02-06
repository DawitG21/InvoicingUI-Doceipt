import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCustomerGroupComponent } from './setup-customer-group.component';

describe('SetupCustomerGroupComponent', () => {
  let component: SetupCustomerGroupComponent;
  let fixture: ComponentFixture<SetupCustomerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCustomerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCustomerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
