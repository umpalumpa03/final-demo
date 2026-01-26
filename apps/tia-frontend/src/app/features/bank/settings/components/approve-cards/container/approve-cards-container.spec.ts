import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveCardsContainer } from './approve-cards-container';

describe('ApproveCardsContainer', () => {
  let component: ApproveCardsContainer;
  let fixture: ComponentFixture<ApproveCardsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCardsContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCardsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
