import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickActionsSection } from './quick-actions-section';

describe('QuickActionsSection', () => {
  let component: QuickActionsSection;
  let fixture: ComponentFixture<QuickActionsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickActionsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
