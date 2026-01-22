import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Colorpalettes } from './colorpalettes';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { Palettes } from '../../../../../../shared/lib/palettes/palettes';

describe('Colorpalettes', () => {
  let component: Colorpalettes;
  let fixture: ComponentFixture<Colorpalettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colorpalettes, LibraryTitle, ShowcaseCard, Palettes],
    }).compileComponents();

    fixture = TestBed.createComponent(Colorpalettes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title property', () => {
    expect(component.title).toBe('Color Palettes');
  });

  it('should render main container', () => {
    const container = fixture.nativeElement.querySelector(
      '.colorpalettes-container',
    );
    expect(container).toBeTruthy();
  });

  it('should render all three palette components', () => {
    const allPalettes = fixture.nativeElement.querySelectorAll('app-palettes');
    expect(allPalettes.length).toBe(3);

    const paletteElements = fixture.debugElement.queryAll(
      By.css('app-palettes'),
    );
    const paletteComponents = paletteElements.map(
      (debugElement) => debugElement.componentInstance as Palettes,
    );

    const themes = paletteComponents.map((component) => component.theme());

    const hasOceanBlue = themes.includes('oceanblue');
    const hasRoyalBlue = themes.includes('royalblue');
    const hasDeepBlue = themes.includes('deepblue');
    expect(hasOceanBlue && hasRoyalBlue && hasDeepBlue).toBeTruthy();
  });

  it('should render three showcase cards', () => {
    const showcaseCards =
      fixture.nativeElement.querySelectorAll('app-showcase-card');
    expect(showcaseCards.length).toBe(3);
  });

  it('should render library title component', () => {
    const libraryTitle =
      fixture.nativeElement.querySelector('app-library-title');
    expect(libraryTitle).toBeTruthy();
  });
});
