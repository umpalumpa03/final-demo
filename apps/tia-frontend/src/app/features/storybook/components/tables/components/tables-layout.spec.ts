import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TablesLayout } from './tables-layout';

describe('TablesLayout', () => {
  let component: TablesLayout;
  let fixture: ComponentFixture<TablesLayout>;

  const translateServiceMock = {
    get: vi.fn().mockReturnValue(of('')),
    instant: vi.fn().mockImplementation((key: string) => key),
    stream: vi.fn().mockReturnValue(of('')),
    use: vi.fn().mockReturnValue(of('')),
    currentLang: 'en',
    defaultLang: 'en',
    onTranslationChange: new EventEmitter(),
    onLangChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesLayout],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    })
      .overrideComponent(TablesLayout, {
        set: {
          // 🔥 remove ALL template imports to isolate logic
          imports: [],
          template: '', // remove template completely
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TablesLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all config signals', () => {
    expect(component.basicConfig()).toBeDefined();
    expect(component.rowConfig()).toBeDefined();
    expect(component.actionsConfig()).toBeDefined();
    expect(component.sortableConfig()).toBeDefined();
    expect(component.strippedConfig()).toBeDefined();
    expect(component.compactConfig()).toBeDefined();
    expect(component.rowStatesConfig()).toBeDefined();
    expect(component.transactionsConfig()).toBeDefined();
  });

  it('should initialize loading and error signals with false', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
  });

  it('should set loading to true when onPageChange is called', () => {
    vi.useFakeTimers();

    component.onPageChange(2);

    expect(component.isLoading()).toBe(true);

    vi.advanceTimersByTime(500);
  });

  it('should reset error and set loading on errorReload', () => {
    vi.useFakeTimers();

    component.hasError.set(true);

    component.errorReload(1);

    expect(component.hasError()).toBe(false);
    expect(component.isLoading()).toBe(true);

    vi.advanceTimersByTime(500);
  });

  it('should handle successful data load and update basicConfig', () => {
    vi.useFakeTimers();

    vi.spyOn(Math, 'random').mockReturnValue(0.6); // success

    component.onPageChange(2);

    vi.advanceTimersByTime(500);

    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.basicConfig().rows).toBeDefined();
  });

  it('should handle error case and set error state', () => {
    vi.useFakeTimers();

    vi.spyOn(Math, 'random').mockReturnValue(0.3); // error

    component.onPageChange(2);

    vi.advanceTimersByTime(500);

    expect(component.hasError()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });
});
