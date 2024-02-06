import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupServiceComponent } from './setup-service.component';

describe('SetupServiceComponent', () => {
  let component: SetupServiceComponent;
  let fixture: ComponentFixture<SetupServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
