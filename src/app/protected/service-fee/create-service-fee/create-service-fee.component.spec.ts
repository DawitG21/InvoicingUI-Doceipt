import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceFeeComponent } from './create-service-fee.component';

describe('CreateServiceFeeComponent', () => {
  let component: CreateServiceFeeComponent;
  let fixture: ComponentFixture<CreateServiceFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServiceFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServiceFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
