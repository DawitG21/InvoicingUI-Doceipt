import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectorComponent } from './edit-connector.component';

describe('EditConnectorComponent', () => {
  let component: EditConnectorComponent;
  let fixture: ComponentFixture<EditConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
