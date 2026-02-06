import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansGrid } from './loans-grid';

describe('LoansGrid', () => {
  let component: LoansGrid;
  let fixture: ComponentFixture<LoansGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
