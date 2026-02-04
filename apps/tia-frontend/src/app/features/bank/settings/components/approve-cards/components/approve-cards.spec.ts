import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveCards } from './approve-cards';

describe('ApproveCards', () => {
  let component: ApproveCards;
  let fixture: ComponentFixture<ApproveCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCards],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
