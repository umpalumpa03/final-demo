import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Colorpalettes } from './colorpalettes';

describe('Colorpalettes', () => {
  let component: Colorpalettes;
  let fixture: ComponentFixture<Colorpalettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colorpalettes],
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
    const oceanblue = fixture.nativeElement.querySelector(
      'app-palettes[theme="oceanblue"]',
    );
    const royalblue = fixture.nativeElement.querySelector(
      'app-palettes[theme="royalblue"]',
    );
    const deepblue = fixture.nativeElement.querySelector(
      'app-palettes[theme="deepblue"]',
    );
    expect(oceanblue && royalblue && deepblue).toBeTruthy();
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
