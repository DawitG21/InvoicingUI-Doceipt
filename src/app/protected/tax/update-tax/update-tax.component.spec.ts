import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaxComponent } from './update-tax.component';

describe('UpdateTaxComponent', () => {
  let component: UpdateTaxComponent;
  let fixture: ComponentFixture<UpdateTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
