import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceFeeComponent } from './update-service-fee.component';

describe('UpdateServiceFeeComponent', () => {
  let component: UpdateServiceFeeComponent;
  let fixture: ComponentFixture<UpdateServiceFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateServiceFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServiceFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
