import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notes } from './notes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      storybook: {
        palette: {
          notes: {
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
describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Notes,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return 4 notes', () => {
    expect(component.notes().length).toBe(4);
  });

  it('should have valid note structure', () => {
    const notes = component.notes();
    notes.forEach((note) => {
      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('description');
      expect(note).toHaveProperty('icon');
    });
  });

  it('should have oceanblue as default theme', () => {
    expect(component.theme()).toBe('oceanblue');
    expect(typeof component.theme()).toBe('string');
  });
});
