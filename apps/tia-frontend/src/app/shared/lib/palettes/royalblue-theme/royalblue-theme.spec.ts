import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoyalblueTheme } from './royalblue-theme';
import { ROYALBLUE_PALETTE_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load ROYALBLUE_PALETTE_DATA', () => {
    expect(component.swatches).toEqual(ROYALBLUE_PALETTE_DATA);
  });

  it('should have 6 color swatches', () => {
    expect(component.swatches.length).toBe(6);
  });

  it('should render palette with correct swatches', () => {
    fixture.detectChanges();
    const swatchItems =
      fixture.nativeElement.querySelectorAll('.palette__item');
    expect(swatchItems.length).toBe(6);
  });

  it('should render palette container with royalblue class', () => {
    fixture.detectChanges();
    const paletteContainer = fixture.nativeElement.querySelector(
      '.palette--royalblue',
    );
    expect(paletteContainer).toBeTruthy();
  });
});
