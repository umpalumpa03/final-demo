import { UserModalService } from './user-modal.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UserModalService', () => {
  let service: UserModalService;

  beforeEach(() => {
    service = new UserModalService();
  });

  it('should open details modal', () => {
    service.openDetails();
    expect(service.modalState()).toBe('details');
    expect(service.isDetailsOpen).toBe(true);
  });

  it('should open delete modal', () => {
    service.openDelete('123');
    expect(service.modalState()).toBe('delete');
    expect(service.userToDeleteId()).toBe('123');
    expect(service.isDeleteOpen).toBe(true);
  });
});
