import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSearchPageComponent } from './contact-search-page.component';

describe('ContactSearchPageComponent', () => {
  let component: ContactSearchPageComponent;
  let fixture: ComponentFixture<ContactSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
