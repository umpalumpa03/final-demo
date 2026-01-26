import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveCardsComponent } from './approve-cards.component';

describe('ApproveCardsComponent', () => {
  let component: ApproveCardsComponent;
  let fixture: ComponentFixture<ApproveCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
