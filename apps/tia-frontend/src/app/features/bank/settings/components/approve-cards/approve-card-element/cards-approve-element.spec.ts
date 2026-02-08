import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsApproveElement } from './cards-approve-element';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('CardsApproveElement', () => {
  let component: CardsApproveElement;
  let fixture: ComponentFixture<CardsApproveElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardsApproveElement, 
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsApproveElement);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'card-123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action with correct payload when onAction is called', () => {
    const spy = vi.spyOn(component.cardAction, 'emit');
    component.onAction('approve');
    expect(spy).toHaveBeenCalledWith({ action: 'approve', id: 'card-123' });
  });

  it('should toggle the settings button based on marked input', () => {
    fixture.componentRef.setInput('marked', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.approve-card__marked'))).toBeFalsy();

    fixture.componentRef.setInput('marked', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.approve-card__marked'))).toBeTruthy();
  });

  it('should display the balance only if it is provided', () => {
    fixture.componentRef.setInput('balance', '');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.approve-card__details--bold'))).toBeFalsy();

    fixture.componentRef.setInput('balance', '500.00 USD');
    fixture.detectChanges();
    const balanceEl = fixture.debugElement.query(By.css('.approve-card__details--bold'));
    expect(balanceEl.nativeElement.textContent).toContain('500.00 USD');
  });

  it('should correctly format the creation date using DatePipe', () => {
    fixture.componentRef.setInput('creationDate', '2026-02-08');
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('08/02/2026');
  });

  it('should render the full list of buttons from the config', () => {
    const renderedButtons = fixture.debugElement.queryAll(By.css('.approve-card__btn'));
    expect(renderedButtons.length).toBe(component.buttons.length);
  });

  it('should trigger onAction when a template button is clicked', () => {
    const spy = vi.spyOn(component, 'onAction');
    const firstBtn = fixture.debugElement.query(By.css('.approve-card__btn'));
    firstBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});