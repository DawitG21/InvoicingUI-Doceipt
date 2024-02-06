import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignContactDialogComponent } from './assign-contact-dialog.component';

describe('AssignContactDialogComponent', () => {
  let component: AssignContactDialogComponent;
  let fixture: ComponentFixture<AssignContactDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignContactDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
