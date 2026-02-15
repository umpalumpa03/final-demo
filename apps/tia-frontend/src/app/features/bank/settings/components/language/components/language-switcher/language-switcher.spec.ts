import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcher } from './language-switcher';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-api.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;
  let fixture: ComponentFixture<LanguageSwitcher>;
  let translateService: TranslateService;

  const mockLanguageService = {
    updateUserLanguage: vi.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageService, useValue: mockLanguageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load saved language from localStorage', () => {
    localStorage.setItem('language', 'ka');
    
    const newFixture = TestBed.createComponent(LanguageSwitcher);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.currentLanguage()).toBe('ka');
  });

  it('should toggle dropdown open and close', () => {
    expect(component.isOpen()).toBe(false);
    
    component.toggleDropdown();
    expect(component.isOpen()).toBe(true);
    
    component.toggleDropdown();
    expect(component.isOpen()).toBe(false);
  });

  it('should switch language and update localStorage', () => {
    const useSpy = vi.spyOn(translateService, 'use');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    component.switchLanguage('ka');

    expect(component.currentLanguage()).toBe('ka');
    expect(useSpy).toHaveBeenCalledWith('ka');
    expect(setItemSpy).toHaveBeenCalledWith('language', 'ka');
    expect(mockLanguageService.updateUserLanguage).toHaveBeenCalledWith('georgian');
    expect(component.isOpen()).toBe(false);
  });

  it('should get current language object', () => {
    component.currentLanguage.set('ka');
    const currentLang = component.getCurrentLanguage();
    
    expect(currentLang?.code).toBe('ka');
    expect(currentLang?.label).toBe('ქართული');
  });
});