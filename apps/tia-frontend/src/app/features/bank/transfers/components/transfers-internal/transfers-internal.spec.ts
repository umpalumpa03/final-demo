import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfersInternal } from './transfers-internal';

describe('TransfersInternal', () => {
  let component: TransfersInternal;
  let fixture: ComponentFixture<TransfersInternal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersInternal],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersInternal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
