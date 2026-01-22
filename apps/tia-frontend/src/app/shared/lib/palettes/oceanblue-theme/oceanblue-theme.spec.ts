import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OceanblueTheme } from './oceanblue-theme';
import { OCEANBLUE_PALETTE_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

describe('OceanblueTheme', () => {
  let component: OceanblueTheme;
  let fixture: ComponentFixture<OceanblueTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OceanblueTheme],
    }).compileComponents();

    fixture = TestBed.createComponent(OceanblueTheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load OCEANBLUE_PALETTE_DATA', () => {
    expect(component.swatches).toEqual(OCEANBLUE_PALETTE_DATA);
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

  it('should render palette container with oceanblue class', () => {
    fixture.detectChanges();
    const paletteContainer = fixture.nativeElement.querySelector(
      '.palette--oceanblue',
    );
    expect(paletteContainer).toBeTruthy();
  });
});
