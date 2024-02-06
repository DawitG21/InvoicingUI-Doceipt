import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinancialPeriodComponent } from './add-financial-period.component';

describe('AddFinancialPeriodComponent', () => {
  let component: AddFinancialPeriodComponent;
  let fixture: ComponentFixture<AddFinancialPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFinancialPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFinancialPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
