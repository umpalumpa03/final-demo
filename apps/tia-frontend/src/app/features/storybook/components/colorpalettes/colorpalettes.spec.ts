import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Colorpalettes } from './colorpalettes';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { Palettes } from '@tia/shared/lib/palettes/palettes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      storybook: {
        palette: {
          title: 'T',
          subtitle: 'S',
          colorNames: {
            primary: 'P',
            secondary: 'S',
            accent: 'A',
            muted: 'M',
            background: 'B',
            foreground: 'F',
          },
          themes: {
            oceanBlue: { title: 'OB', subtitle: 'OB', label: 'OB' },
            royalBlue: { title: 'RB', subtitle: 'RB', label: 'RB' },
            deepBlue: { title: 'DB', subtitle: 'DB', label: 'DB' },
          },
          application: {
            title: 'A',
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
          notes: {
            title: 'N',
            items: {
              highContrast: { title: 'HC', description: 'D' },
              consistentHierarchy: { title: 'CH', description: 'D' },
              flexibleApplication: { title: 'FA', description: 'D' },
              easySwitching: { title: 'ES', description: 'D' },
            },
          },
        },
      },
    });
  }
}

describe('Colorpalettes', () => {
  let component: Colorpalettes;
  let fixture: ComponentFixture<Colorpalettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Colorpalettes,
        LibraryTitle,
        ShowcaseCard,
        Palettes,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Colorpalettes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all three palette components', () => {
    const allPalettes = fixture.nativeElement.querySelectorAll('app-palettes');
    expect(allPalettes.length).toBe(3);
  });

  it('should render five showcase cards', () => {
    const showcaseCards =
      fixture.nativeElement.querySelectorAll('app-showcase-card');
    expect(showcaseCards.length).toBe(5);
  });
});
