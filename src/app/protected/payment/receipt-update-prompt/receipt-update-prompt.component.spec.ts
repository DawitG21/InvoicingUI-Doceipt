import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptUpdatePromptComponent } from './receipt-update-prompt.component';

describe('ReceiptUpdatePromptComponent', () => {
  let component: ReceiptUpdatePromptComponent;
  let fixture: ComponentFixture<ReceiptUpdatePromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptUpdatePromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptUpdatePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
