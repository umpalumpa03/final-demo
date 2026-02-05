import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDetailsModalContent } from './card-details-modal-content';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CardDetailsModalContent', () => {
  let component: CardDetailsModalContent;
  let fixture: ComponentFixture<CardDetailsModalContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailsModalContent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardDetailsModalContent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('cardName', 'Test Card');
    fixture.componentRef.setInput('cardType', 'VISA');
    fixture.componentRef.setInput('cardCategory', 'CREDIT');
    fixture.componentRef.setInput('currency', 'GEL');
    fixture.componentRef.setInput('status', 'ACTIVE');
    fixture.componentRef.setInput('isActiveStatus', true);
    fixture.componentRef.setInput('formattedBalance', 'GEL 1,000');
    fixture.componentRef.setInput('shouldShowCreditLimit', true);
    fixture.componentRef.setInput('formattedCreditLimit', 'GEL 5,000');
    fixture.componentRef.setInput('isUpdating', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit requestOtpClicked', () => {
    const spy = vi.fn();
    component.requestOtpClicked.subscribe(spy);

    component['handleRequestOtp']();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit closeClicked', () => {
    const spy = vi.fn();
    component.closeClicked.subscribe(spy);

    component['handleClose']();

    expect(spy).toHaveBeenCalled();
  });

  it('should enable edit mode', () => {
    const event = new Event('click');
    component['enableEdit'](event);

    expect(component['isEditing']()).toBe(true);
    expect(component['nameControl'].value).toBe('Test Card');
  });

  it('should emit cardNameUpdated on save', () => {
    const spy = vi.fn();
    component.cardNameUpdated.subscribe(spy);

    component['nameControl'].setValue('New Name');
    component['onSave']();

    expect(spy).toHaveBeenCalledWith('New Name');
    expect(component['isEditing']()).toBe(false);
  });

  it('should not emit if name unchanged', () => {
    const spy = vi.fn();
    component.cardNameUpdated.subscribe(spy);

    component['nameControl'].setValue('Test Card');
    component['onSave']();

    expect(spy).not.toHaveBeenCalled();
  });
});