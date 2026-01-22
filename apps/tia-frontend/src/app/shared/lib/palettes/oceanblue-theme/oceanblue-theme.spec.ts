import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OceanblueTheme } from './oceanblue-theme';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have swatches property', () => {
    expect(component.swatches).toBeDefined();
    expect(Array.isArray(component.swatches)).toBe(true);
  });

  it('should have oceanblue palette data', () => {
    expect(component.swatches.length).toBeGreaterThan(0);
  });

  it('should have palette items with required properties', () => {
    component.swatches.forEach((swatch) => {
      expect(swatch.name).toBeDefined();
      expect(swatch.code).toBeDefined();
      expect(swatch.modifier).toBeDefined();
    });
  });

  it('should render the theme component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should have correct selector', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
