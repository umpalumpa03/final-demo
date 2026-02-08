import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Palettes } from './palettes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      storybook: {
        palette: {
          colorNames: {
            primary: 'P',
            secondary: 'S',
            accent: 'A',
            muted: 'M',
            background: 'B',
            foreground: 'F',
          },
        },
      },
    });
  }
}

describe('Palettes', () => {
  let component: Palettes;
  let fixture: ComponentFixture<Palettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Palettes,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
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

  it('should have 6 color swatches', () => {
    expect(component.swatches().length).toBe(6);
  });

  it('should render palette with correct swatches', () => {
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
