import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorApplication } from './color-application';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      storybook: {
        palette: {
          application: {
            oceanBlue: {
              primary: { title: 'P', description: 'D' },
              accent: { title: 'A', description: 'D' },
              muted: { title: 'M', description: 'D' },
            },
            royalBlue: {
              primary: { title: 'P', description: 'D' },
              accent: { title: 'A', description: 'D' },
              muted: { title: 'M', description: 'D' },
            },
            deepBlue: {
              primary: { title: 'P', description: 'D' },
              accent: { title: 'A', description: 'D' },
              muted: { title: 'M', description: 'D' },
            },
          },
        },
      },
    });
  }
}

describe('ColorApplication', () => {
  let component: ColorApplication;
  let fixture: ComponentFixture<ColorApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ColorApplication,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have oceanblue as default theme', () => {
    expect(component.theme()).toBe('oceanblue');
  });

  it('should return 3 applications with valid structure', () => {
    const apps = component.applications();
    expect(apps.length).toBe(3);
    apps.forEach((app) => {
      expect(app).toHaveProperty('title');
      expect(app).toHaveProperty('description');
      expect(app).toHaveProperty('modifier');
    });
  });

  it('should have unique modifiers within a theme', () => {
    const apps = component.applications();
    const modifiers = apps.map((app) => app.modifier);
    const uniqueModifiers = new Set(modifiers);
    expect(uniqueModifiers.size).toBe(modifiers.length);
  });

  it('should not mutate application data', () => {
    const apps1 = component.applications();
    const apps2 = component.applications();
    expect(apps1).toEqual(apps2);
    expect(apps1).toBe(apps2);
  });
});
