import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInvitesPreviewComponent } from './user-invites-preview.component';

describe('UserInvitesPreviewComponent', () => {
  let component: UserInvitesPreviewComponent;
  let fixture: ComponentFixture<UserInvitesPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInvitesPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInvitesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
