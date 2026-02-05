import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelection } from './language-selection';
import { LanguagesStore } from '../../store/languages.store';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/shared/services/settings-language/alert.service';
import { Language } from '../../models/language.model';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

const mockLanguages: Language[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'English',
    flagUrl: 'flag-en.svg',
    value: 'en',
    region: 'United States',
    speakerCount: '1.5B',
  },
  {
    id: 'georgian',
    name: 'Georgian',
    nativeName: 'ქართული',
    flagUrl: 'flag-ka.svg',
    value: 'ka',
    region: 'Georgia',
    speakerCount: '4M',
  },
];

describe('LanguageSelection', () => {
  let component: LanguageSelection;
  let fixture: ComponentFixture<LanguageSelection>;
  let mockLanguagesStore: any;
  let mockTranslateService: any;
  let mockAlertService: any;

  beforeEach(async () => {
    mockLanguagesStore = {
      updateLanguage: vi.fn().mockReturnValue(of(void 0)),
    };

    mockTranslateService = {
      getCurrentLang: vi.fn().mockReturnValue('en'),
      use: vi.fn(),
      instant: vi.fn((key: string) => key),
    };

    mockAlertService = {
      showAlert: vi.fn(),
      alertType: signal(null),
      alertMessage: signal(''),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSelection],
      providers: [
        { provide: LanguagesStore, useValue: mockLanguagesStore },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelection);
    fixture.componentRef.setInput('languages', mockLanguages);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasError', false);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set selected language based on current language', () => {
      component.ngOnInit();
      expect(component.selectedLanguage()).toEqual(mockLanguages[0]);
    });

    it('should default to first language if current language not found', () => {
      mockTranslateService.getCurrentLang.mockReturnValue('fr');
      component.ngOnInit();
      expect(component.selectedLanguage()).toEqual(mockLanguages[0]);
    });

    it('should default to en if getCurrentLang returns null', () => {
      mockTranslateService.getCurrentLang.mockReturnValue(null);
      component.ngOnInit();
      expect(component.selectedLanguage()).toEqual(mockLanguages[0]);
    });

    it('should not set selected language if languages array is empty', () => {
      fixture.componentRef.setInput('languages', []);
      component.ngOnInit();
      expect(component.selectedLanguage()).toBeNull();
    });
  });

  describe('onLanguageSelect', () => {
    it('should update selected language', () => {
      component.onLanguageSelect(mockLanguages[1]);
      expect(component.selectedLanguage()).toEqual(mockLanguages[1]);
    });
  });

  describe('isLanguageSelected', () => {
    it('should return true when language is selected', () => {
      component.selectedLanguage.set(mockLanguages[0]);
      expect(component.isLanguageSelected(mockLanguages[0])).toBe(true);
    });

    it('should return false when language is not selected', () => {
      component.selectedLanguage.set(mockLanguages[0]);
      expect(component.isLanguageSelected(mockLanguages[1])).toBe(false);
    });

    it('should return false when no language is selected', () => {
      component.selectedLanguage.set(null);
      expect(component.isLanguageSelected(mockLanguages[0])).toBe(false);
    });
  });

  describe('onSave', () => {
    it('should update language and show success alert', () => {
      component.selectedLanguage.set(mockLanguages[1]);
      component.onSave();

      expect(mockLanguagesStore.updateLanguage).toHaveBeenCalledWith(
        'georgian',
      );
      expect(mockTranslateService.use).toHaveBeenCalledWith('ka');
      expect(mockAlertService.showAlert).toHaveBeenCalledWith(
        'success',
        'settings.language.saveSuccess',
      );
    });

    it('should show error alert on failure', () => {
      mockLanguagesStore.updateLanguage.mockReturnValue(
        throwError(() => new Error('Update failed')),
      );
      component.selectedLanguage.set(mockLanguages[1]);
      component.onSave();

      expect(mockAlertService.showAlert).toHaveBeenCalledWith(
        'error',
        'settings.language.saveError',
      );
    });

    it('should not call updateLanguage if no language is selected', () => {
      component.selectedLanguage.set(null);
      component.onSave();

      expect(mockLanguagesStore.updateLanguage).not.toHaveBeenCalled();
      expect(mockAlertService.showAlert).not.toHaveBeenCalled();
    });
  });
});
