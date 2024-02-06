import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxDialogComponent } from './add-tax-dialog.component';

describe('AddTaxDialogComponent', () => {
  let component: AddTaxDialogComponent;
  let fixture: ComponentFixture<AddTaxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
