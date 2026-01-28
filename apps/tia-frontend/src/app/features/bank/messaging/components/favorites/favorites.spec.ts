import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Favorites } from './favorites';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MessagingService } from '../../services/messaging-api.service.ts';
import { of } from 'rxjs';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Favorites,
        TranslateModule.forRoot()
      ],
      providers: [
        MessagingStore,
        { provide: MessagingService, useValue: { getInbox: () => of({ items: [], pagination: { hasNextPage: false, nextCursor: null } }) } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
