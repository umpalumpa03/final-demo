import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sent } from './sent';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MessagingService } from '../../services/messaging-api.service';
import { of } from 'rxjs';

describe('Sent', () => {
  let component: Sent;
  let fixture: ComponentFixture<Sent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Sent,
        TranslateModule.forRoot()
      ],
      providers: [
        MessagingStore,
        { provide: MessagingService, useValue: { getInbox: () => of({ items: [], pagination: { hasNextPage: false, nextCursor: null } }) } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
