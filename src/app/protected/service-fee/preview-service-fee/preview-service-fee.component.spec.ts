import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewServiceFeeComponent } from './preview-service-fee.component';

describe('PreviewServiceFeeComponent', () => {
  let component: PreviewServiceFeeComponent;
  let fixture: ComponentFixture<PreviewServiceFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewServiceFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewServiceFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
