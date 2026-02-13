import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablesLayout } from './tables-layout';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('TablesLayout', () => {
  let component: TablesLayout;
  let fixture: ComponentFixture<TablesLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesLayout, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TablesLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.useFakeTimers();
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
    component.onPageChange(2);
    expect(component.isLoading()).toBe(true);
  });

  it('should reset error and set loading on errorReload', () => {
    component.hasError.set(true);

    component.errorReload(1);

    expect(component.hasError()).toBe(false);
    expect(component.isLoading()).toBe(true);
  });

  it('should handle successful data load and update basicConfig', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6);

    component.onPageChange(2);
    vi.advanceTimersByTime(500);

    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.basicConfig().rows).toBeDefined();
  });

  it('should handle error case and set error state', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);

    component.onPageChange(2);
    vi.advanceTimersByTime(500);

    expect(component.hasError()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });
});
