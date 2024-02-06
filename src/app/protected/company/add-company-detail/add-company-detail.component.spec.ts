import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyDetailComponent } from './add-company-detail.component';

describe('AddCompanyDetailComponent', () => {
  let component: AddCompanyDetailComponent;
  let fixture: ComponentFixture<AddCompanyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
