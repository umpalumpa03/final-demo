import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfersExternal } from './transfers-external';

describe('TransfersExternal', () => {
  let component: TransfersExternal;
  let fixture: ComponentFixture<TransfersExternal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersExternal],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersExternal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
