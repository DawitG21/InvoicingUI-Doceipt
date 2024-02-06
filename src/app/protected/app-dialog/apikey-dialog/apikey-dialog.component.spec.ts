import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApikeyDialogComponent } from './apikey-dialog.component';

describe('ApikeyDialogComponent', () => {
  let component: ApikeyDialogComponent;
  let fixture: ComponentFixture<ApikeyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApikeyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApikeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
