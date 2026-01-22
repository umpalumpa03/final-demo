import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeepblueTheme } from './deepblue-theme';
import { DEEPBLUE_PALETTE_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load DEEPBLUE_PALETTE_DATA', () => {
    expect(component.swatches).toEqual(DEEPBLUE_PALETTE_DATA);
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

  it('should render palette container with deepblue class', () => {
    fixture.detectChanges();
    const paletteContainer =
      fixture.nativeElement.querySelector('.palette--deepblue');
    expect(paletteContainer).toBeTruthy();
  });
});
