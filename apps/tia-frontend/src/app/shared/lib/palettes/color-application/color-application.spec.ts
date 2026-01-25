import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorApplication } from './color-application';
import {
  colorApplication,
  OCEANBLUE_APPLICATION_DATA,
  ROYALBLUE_APPLICATION_DATA,
  DEEPBLUE_APPLICATION_DATA,
} from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/config/palette-data.config';

describe('ColorApplication', () => {
  let component: ColorApplication;
  let fixture: ComponentFixture<ColorApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have oceanblue as default theme and themeLabel optional', () => {
    expect(component.theme()).toBe('oceanblue');
    expect(typeof component.theme()).toBe('string');
    expect(component.themeLabel()).toBeUndefined();
  });

  it('should return oceanblue applications with required properties', () => {
    const apps = component.applications();
    expect(apps).toEqual(OCEANBLUE_APPLICATION_DATA);
    expect(Array.isArray(apps)).toBe(true);
    expect(apps.length).toBeGreaterThanOrEqual(3);

    apps.forEach((app) => {
      expect(app).toHaveProperty('title');
      expect(app).toHaveProperty('description');
      expect(app).toHaveProperty('modifier');
      expect(app.title.trim().length).toBeGreaterThan(0);
      expect(app.description.trim().length).toBeGreaterThan(0);
    });
  });

  it('should have unique modifiers within a theme', () => {
    const apps = component.applications();
    const modifiers = apps.map((app) => app.modifier);
    const uniqueModifiers = new Set(modifiers);
    expect(uniqueModifiers.size).toBe(modifiers.length);
  });

  it('should have all three theme variations with consistent structure', () => {
    expect(colorApplication).toHaveProperty('oceanblue');
    expect(colorApplication).toHaveProperty('royalblue');
    expect(colorApplication).toHaveProperty('deepblue');

    expect(colorApplication['royalblue']).toEqual(ROYALBLUE_APPLICATION_DATA);
    expect(colorApplication['deepblue']).toEqual(DEEPBLUE_APPLICATION_DATA);

    const themes = ['oceanblue', 'royalblue', 'deepblue'] as const;
    themes.forEach((theme) => {
      const apps = colorApplication[theme];
      expect(apps.length).toBe(3);
      apps.forEach((app) => {
        expect(app).toHaveProperty('title');
        expect(app).toHaveProperty('description');
        expect(app).toHaveProperty('modifier');
      });
    });
  });

  it('should not mutate application data', () => {
    const apps1 = component.applications();
    const apps2 = component.applications();
    expect(apps1).toEqual(apps2);
    expect(apps1).toBe(apps2);
  });
});
