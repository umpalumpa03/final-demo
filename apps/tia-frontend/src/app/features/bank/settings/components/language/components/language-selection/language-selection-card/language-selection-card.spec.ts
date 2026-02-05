import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectionCard } from './language-selection-card';
import { Language } from '../../../models/language.model';

const mockLanguage: Language = {
  id: 'english',
  name: 'English',
  nativeName: 'English',
  flagUrl: 'flag-en.svg',
  value: 'en',
  region: 'United States',
  speakerCount: '1.5B',
};

describe('LanguageSelectionCard', () => {
  let component: LanguageSelectionCard;
  let fixture: ComponentFixture<LanguageSelectionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectionCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('language', mockLanguage);
    fixture.componentRef.setInput('isSelected', false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have language input', () => {
    expect(component.language()).toEqual(mockLanguage);
  });

  it('should have isSelected input default to false', () => {
    expect(component.isSelected()).toBe(false);
  });

  it('should have isSelected input set to true', () => {
    fixture.componentRef.setInput('isSelected', true);
    expect(component.isSelected()).toBe(true);
  });

  it('should emit selected event when card is clicked', () => {
    let emittedLanguage: Language | undefined;
    component.selected.subscribe((language: Language) => {
      emittedLanguage = language;
    });

    component.onCardClick();

    expect(emittedLanguage).toEqual(mockLanguage);
  });

  it('should call onCardClick when card div is clicked', () => {
    const spy = vi.spyOn(component, 'onCardClick');
    const cardElement = fixture.nativeElement.querySelector('.card');

    cardElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
