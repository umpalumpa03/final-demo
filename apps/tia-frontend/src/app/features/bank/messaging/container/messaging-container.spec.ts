import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagingContainer } from './messaging-container';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { of } from 'rxjs';
import { MessagingStore } from '../store/messaging.store';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';

describe('MessagingContainer', () => {
  let component: MessagingContainer;
  let fixture: ComponentFixture<MessagingContainer>;
  let mockRoleStore: any;

  beforeEach(async () => {
    mockRoleStore = {
      selectSignal: vi.fn().mockReturnValue(signal('USER'))
    };
    
    await TestBed.configureTestingModule({
      imports: [
        MessagingContainer,
        TranslateModule.forRoot()
      ],
      providers: [
        MessagingStore,
        { provide: Store, useValue: mockRoleStore },
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: InboxService,
          useValue: {
            getInboxCount: vi.fn(() => of({ count: 0 })),
            fetchInboxCount: vi.fn(),
            inboxCount: vi.fn(() => 0),
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagingContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
