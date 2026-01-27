import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcher } from './language-switcher';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;
  let fixture: ComponentFixture<LanguageSwitcher>;
  let translateService: TranslateService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher],
      providers: [provideTranslateService()],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load saved language from localStorage', async () => {
    localStorage.setItem('language', 'ka');

    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.currentLanguage()).toBe('ka');
  });

  it('should toggle dropdown open and close', () => {
    expect(component.isOpen()).toBe(false);

    component.toggleDropdown();
    expect(component.isOpen()).toBe(true);

    component.toggleDropdown();
    expect(component.isOpen()).toBe(false);
  });

  it('should close dropdown', () => {
    component.isOpen.set(true);

    component.closeDropdown();

    expect(component.isOpen()).toBe(false);
  });

  it('should switch language', () => {
    vi.spyOn(translateService, 'use');
    component.isOpen.set(true);

    component.switchLanguage('ka');

    expect(component.currentLanguage()).toBe('ka');
    expect(translateService.use).toHaveBeenCalledWith('ka');
    expect(localStorage.getItem('language')).toBe('ka');
    expect(component.isOpen()).toBe(false);
  });

  it('should get current language object', () => {
    component.currentLanguage.set('en');

    const lang = component.getCurrentLanguage();

    expect(lang).toEqual({
      code: 'en',
      value: 'english',
      label: 'English',
      flag: '🇬🇧',
    });
  });
});
