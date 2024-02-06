import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupServiceFeeComponent } from './setup-service-fee.component';

describe('SetupServiceFeeComponent', () => {
  let component: SetupServiceFeeComponent;
  let fixture: ComponentFixture<SetupServiceFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupServiceFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupServiceFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
