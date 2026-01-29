import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TransferStore } from './transfers.store';
import { initialTransferState } from './transfers.state';

describe('TransferStore', () => {
  let store: InstanceType<typeof TransferStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferStore],
    });
    store = TestBed.inject(TransferStore);
  });

  it('should create store with initial state', () => {
    expect(store.recipientInput()).toBe('');
    expect(store.recipientType()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('should update recipient input with phone', () => {
    store.setRecipientInput('+995555123456');
    expect(store.recipientInput()).toBe('+995555123456');
  });

  it('should update recipient input with IBAN', () => {
    store.setRecipientInput('GE29TIA7890123456789012');
    expect(store.recipientInput()).toBe('GE29TIA7890123456789012');
  });

  it('should set recipient type to phone', () => {
    store.setRecipientType('phone');
    expect(store.recipientType()).toBe('phone');
  });

  it('should set recipient type to iban-same-bank', () => {
    store.setRecipientType('iban-same-bank');
    expect(store.recipientType()).toBe('iban-same-bank');
  });

  it('should set recipient type to null', () => {
    store.setRecipientType('phone');
    store.setRecipientType(null);
    expect(store.recipientType()).toBeNull();
  });

  it('should set error message', () => {
    store.setError('Invalid IBAN format');
    expect(store.error()).toBe('Invalid IBAN format');
  });

  it('should clear error', () => {
    store.setError('Some error');
    store.setError(null);
    expect(store.error()).toBeNull();
  });

  it('should reset store to initial state', () => {
    store.setRecipientInput('+995555123456');
    store.setRecipientType('phone');
    store.setError('Some error');

    store.reset();

    expect(store.recipientInput()).toBe(initialTransferState.recipientInput);
    expect(store.recipientType()).toBe(initialTransferState.recipientType);
    expect(store.error()).toBe(initialTransferState.error);
  });
});
