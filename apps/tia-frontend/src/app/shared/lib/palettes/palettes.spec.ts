import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Palettes } from './palettes';
import { OCEANBLUE_PALETTE_DATA } from '../../../features/storybook/components/colorpalettes/config/palette-data.config';

describe('Palettes', () => {
  let component: Palettes;
  let fixture: ComponentFixture<Palettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Palettes],
    }).compileComponents();

    fixture = TestBed.createComponent(Palettes);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('theme', 'oceanblue');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load OCEANBLUE_PALETTE_DATA', () => {
    expect(component.swatches()).toEqual(OCEANBLUE_PALETTE_DATA);
  });

  it('should have 6 color swatches', () => {
    expect(component.swatches().length).toBe(6);
  });

  it('should render palette with correct swatches', () => {
    fixture.detectChanges();
    const swatchItems =
      fixture.nativeElement.querySelectorAll('.palette__item');
    expect(swatchItems.length).toBe(6);
  });

  it('should render palette container with oceanblue class', () => {
    fixture.detectChanges();
    const paletteContainer =
      fixture.nativeElement.querySelector('.theme-oceanblue');
    expect(paletteContainer).toBeTruthy();
  });
});
