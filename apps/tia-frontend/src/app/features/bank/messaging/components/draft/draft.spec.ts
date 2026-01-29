import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Draft } from './draft';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MessagingService } from '../../services/messaging-api.service';
import { of } from 'rxjs';

describe('Draft', () => {
  let component: Draft;
  let fixture: ComponentFixture<Draft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Draft,
        TranslateModule.forRoot()
      ],
      providers: [
        MessagingStore,
        { provide: MessagingService, useValue: { getInbox: () => of({ items: [], pagination: { hasNextPage: false, nextCursor: null } }) } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Draft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
