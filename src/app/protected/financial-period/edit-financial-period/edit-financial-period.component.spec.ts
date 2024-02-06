import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinancialPeriodComponent } from './edit-financial-period.component';

describe('EditFinancialPeriodComponent', () => {
  let component: EditFinancialPeriodComponent;
  let fixture: ComponentFixture<EditFinancialPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFinancialPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFinancialPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
