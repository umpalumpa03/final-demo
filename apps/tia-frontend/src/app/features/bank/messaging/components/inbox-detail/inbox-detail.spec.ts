import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InboxDetail } from './inbox-detail';
import { MessagingStore } from '../../store/messaging.store';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InboxDetail', () => {
  let component: InboxDetail;
  let fixture: ComponentFixture<InboxDetail>;

  beforeEach(async () => {
    const mockMessagingStore = {
      emailDetail: signal(null),
      getEmailById: vi.fn(),
      isLoading: signal(false)
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [InboxDetail],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InboxDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEmailById on init', () => {
    const store = TestBed.inject(MessagingStore);
    component.ngOnInit();
    expect(store.getEmailById).toHaveBeenCalledWith(1);
  });
});