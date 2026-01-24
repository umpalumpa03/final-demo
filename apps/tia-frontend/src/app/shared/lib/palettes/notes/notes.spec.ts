import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notes } from './notes';
import { NOTES_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notes],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return NOTES_DATA with required properties', () => {
    const notes = component.notes();
    expect(notes).toEqual(NOTES_DATA);
    expect(Array.isArray(notes)).toBe(true);
    expect(notes.length).toBeGreaterThanOrEqual(4);

    notes.forEach((note) => {
      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('description');
      expect(note).toHaveProperty('icon');
      expect(note.title.trim().length).toBeGreaterThan(0);
      expect(note.description.trim().length).toBeGreaterThan(0);
    });
  });

  it('should have unique note ids', () => {
    const notes = component.notes();
    const ids = notes.map((note) => note.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid icon identifiers', () => {
    const notes = component.notes();
    const validIcons = [
      'high-contrast',
      'consistent-hierarchy',
      'flexible-application',
      'easy-switching',
    ];
    notes.forEach((note) => {
      expect(validIcons).toContain(note.icon);
    });
  });

  it('should have oceanblue as default theme', () => {
    expect(component.theme()).toBe('oceanblue');
    expect(typeof component.theme()).toBe('string');
  });
});
