import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoyalblueTheme } from './royalblue-theme';

describe('RoyalblueTheme', () => {
  let component: RoyalblueTheme;
  let fixture: ComponentFixture<RoyalblueTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyalblueTheme],
    }).compileComponents();

    fixture = TestBed.createComponent(RoyalblueTheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
