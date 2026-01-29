import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Important } from './important';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MessagingService } from '../../services/messaging-api.service';
import { of } from 'rxjs';

describe('Important', () => {
  let component: Important;
  let fixture: ComponentFixture<Important>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Important,
        TranslateModule.forRoot()
      ],
      providers: [
        MessagingStore,
                { provide: MessagingService, useValue: { getInbox: () => of({ items: [], pagination: { hasNextPage: false, nextCursor: null } }) } }
        
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Important);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
