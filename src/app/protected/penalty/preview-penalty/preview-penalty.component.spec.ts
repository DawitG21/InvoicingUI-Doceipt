import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPenaltyComponent } from './preview-penalty.component';

describe('PreviewPenaltyComponent', () => {
  let component: PreviewPenaltyComponent;
  let fixture: ComponentFixture<PreviewPenaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPenaltyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
