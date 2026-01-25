import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfersContainer } from './transfers-container';

describe('TransfersContainer', () => {
  let component: TransfersContainer;
  let fixture: ComponentFixture<TransfersContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
