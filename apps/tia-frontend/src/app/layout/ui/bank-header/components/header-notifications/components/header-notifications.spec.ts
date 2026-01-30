import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderNotifications } from './header-notifications';
import { NotificationsStore } from '../store/notifications.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ItemsData } from '../models/notification.model';

describe('HeaderNotifications', () => {
  let component: HeaderNotifications;
  let fixture: ComponentFixture<HeaderNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNotifications],
      providers: [NotificationsStore],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if item is in selectedItems input', () => {
    (component as any).selectedItems = () => ['1', '2', '3'];

    expect(component.isItemSelected('2')).toBe(true);
    expect(component.isItemSelected('99')).toBe(false);
  });

  it('should emit deleteNotification when onTrashIconClick is called', () => {
    const spy = vi.spyOn(component.deleteNotification, 'emit');
    const id = 'notif-123';

    component.onTrashIconClick(id);

    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should emit selectAll when onSelectAllClicked is called', () => {
    const spy = vi.spyOn(component.selectAll, 'emit');
    const mockItems: ItemsData[] = [{ id: '1' } as any, { id: '2' } as any];

    component.onSelectAllClicked(mockItems);

    expect(spy).toHaveBeenCalledWith(mockItems);
  });

  it('should emit markAllAsRead when onMarkAllClick is called', () => {
    const spy = vi.spyOn(component.markAllAsRead, 'emit');

    component.onMarkAllClick();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit scrollBottom when onScrollBottom is called', () => {
    const spy = vi.spyOn(component.scrollBottom, 'emit');

    component.onScrollBottom();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit itemVisible when onItemBecameVisible is called', () => {
    const spy = vi.spyOn(component.itemVisible, 'emit');
    const id = 'visible-id';

    component.onItemBecameVisible(id);

    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should emit deleteMultipleNotification when OnDeleteMultipleClick is called', () => {
    const spy = vi.spyOn(component.deleteMultipleNotification, 'emit');
    const ids = ['1', '2'];

    component.OnDeleteMultipleClick(ids);

    expect(spy).toHaveBeenCalledWith(ids);
  });

  it('should emit deleteAllNotification when onDeleteAllClicked is called', () => {
    const spy = vi.spyOn(component.deleteAllNotification, 'emit');

    component.onDeleteAllClicked();

    expect(spy).toHaveBeenCalled();
  });
});
