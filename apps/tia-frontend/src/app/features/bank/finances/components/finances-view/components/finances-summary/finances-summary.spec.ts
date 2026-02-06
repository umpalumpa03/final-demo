import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesSummary } from './finances-summary';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Spinner } from '../../../../../../../shared/lib/feedback/spinner/spinner'; 
import { BasicAlerts } from '../../../../../../../shared/lib/alerts/components/basic-alerts/basic-alerts';

describe('FinancesSummary', () => {
  let component: FinancesSummary;
  let fixture: ComponentFixture<FinancesSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesSummary, Spinner, BasicAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesSummary);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('app-spinner'));
    const loadingText = fixture.debugElement.query(By.css('span')).nativeElement;

    expect(spinner).toBeTruthy();
    expect(loadingText.textContent).toContain('Syncing your finances');
  });



  it('should emit retry when "Try Again" is clicked', () => {
    const retrySpy = vi.spyOn(component.retry, 'emit');
    fixture.componentRef.setInput('error', 'Error');
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.detectChanges();

    const retryBtn = fixture.debugElement.query(By.css('app-button'));
    retryBtn.triggerEventHandler('click', null);

    expect(retrySpy).toHaveBeenCalledWith('month');
  });

  

  it('should show empty state message when no cards and not loading', () => {
    fixture.componentRef.setInput('summaryCards', []);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const noData = fixture.debugElement.query(By.css('.no-data'));
    expect(noData.nativeElement.textContent).toContain('couldn\'t find any records');
  });
});