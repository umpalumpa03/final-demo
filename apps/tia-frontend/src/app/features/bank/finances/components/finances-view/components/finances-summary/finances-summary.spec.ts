import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesSummary } from './finances-summary';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinancesSummary', () => {
  let component: FinancesSummary;
  let fixture: ComponentFixture<FinancesSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FinancesSummary, 
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesSummary);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', null);
    fixture.componentRef.setInput('summaryCards', []);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('app-spinner'));
    const loadingWrapper = fixture.debugElement.query(By.css('.finances-summary__loading-wrapper'));

    expect(spinner).toBeTruthy();
    expect(loadingWrapper).toBeTruthy();
  });

  it('should show error message and retry button when error occurs', () => {
    const errorMessage = 'Something went wrong';
    fixture.componentRef.setInput('error', errorMessage);
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('app-basic-alerts'));
    const retryBtn = fixture.debugElement.query(By.css('app-button'));

    expect(alert).toBeTruthy();
    expect(retryBtn).toBeTruthy();
  });

  it('should emit retry when retry button is clicked', () => {
    const retrySpy = vi.spyOn(component.retry, 'emit');
    
    fixture.componentRef.setInput('error', 'Error');
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.detectChanges();

    const retryBtn = fixture.debugElement.query(By.css('app-button'));
    retryBtn.triggerEventHandler('click', null);

    expect(retrySpy).toHaveBeenCalledWith('month');
  });

  it('should render statistic cards when data is provided', () => {
    const mockCards = [
      { label: 'Income', value: '1000', change: '+5%', changeType: 'increase', icon: 'icon' }
    ];
    fixture.componentRef.setInput('summaryCards', mockCards);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-statistic-card'));
    expect(cards.length).toBe(1);
  });

  it('should show empty state message when no cards and not loading', () => {
    fixture.componentRef.setInput('summaryCards', []);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const noData = fixture.debugElement.query(By.css('.no-data'));
    expect(noData).toBeTruthy();
  });
});