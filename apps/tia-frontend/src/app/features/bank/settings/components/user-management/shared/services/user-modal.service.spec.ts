import { UserModalService } from './user-modal.service';
import { describe, it, expect } from 'vitest';

describe('UserModalService', () => {
  const service = new UserModalService();

  it('should manage states correctly', () => {
    service.openDetails();
    expect(service.isDetailsOpen).toBe(true);

    service.openEdit();
    expect(service.isEditOpen).toBe(true);

    service.openDelete('123');
    expect(service.isDeleteOpen).toBe(true);
    expect(service.userToDeleteId()).toBe('123');

    service.close();
    expect(service.modalState()).toBe('none');
    expect(service.userToDeleteId()).toBeNull();
  });
});
