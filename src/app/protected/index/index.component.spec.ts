import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexComponent } from './index.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { MockAuthService } from 'src/app/shared/mocks/mock-auth-service';
import { ProtectedService } from '../protected.service';
import { MockTopSecretService } from 'src/app/shared/mocks/mock-top-secret-service';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndexComponent],
      imports: [NgxSpinnerModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService},
        { provide: ProtectedService, useClass: MockTopSecretService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
