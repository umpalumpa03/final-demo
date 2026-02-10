import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailHeader } from './mail-header';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MailHeader', () => {
  let component: MailHeader;
  let fixture: ComponentFixture<MailHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MailHeader,
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MailHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the delete modal when onDeleteClick is called', () => {
    expect(component.isDeleteModalOpen()).toBe(false);
    component.onDeleteClick();
    expect(component.isDeleteModalOpen()).toBe(true);
  });

  it('should emit bulkDelete and close modal after delete completes', () => {
    const emitSpy = vi.spyOn(component.bulkDelete, 'emit');

    component.isDeleteModalOpen.set(true);
    component.onConfirmDelete();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.isDeleteModalOpen()).toBe(true);

    fixture.componentRef.setInput('isDeleting', true);
    fixture.detectChanges();

    expect(component.isDeleteModalOpen()).toBe(true);

    fixture.componentRef.setInput('isDeleting', false);
    fixture.detectChanges();

    expect(component.isDeleteModalOpen()).toBe(false);
  });
});
