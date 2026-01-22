import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeepblueTheme } from './deepblue-theme';

describe('DeepblueTheme', () => {
  let component: DeepblueTheme;
  let fixture: ComponentFixture<DeepblueTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepblueTheme],
    }).compileComponents();

    fixture = TestBed.createComponent(DeepblueTheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
