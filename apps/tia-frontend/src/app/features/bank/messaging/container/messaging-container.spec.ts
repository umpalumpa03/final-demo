import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagingContainer } from './messaging-container';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { of } from 'rxjs';

describe('MessagingContainer', () => {
  let component: MessagingContainer;
  let fixture: ComponentFixture<MessagingContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MessagingContainer,
        TranslateModule.forRoot()
      ],
      providers: [
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
