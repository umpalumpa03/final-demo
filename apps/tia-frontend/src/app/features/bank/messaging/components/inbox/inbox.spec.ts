import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inbox } from './inbox';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';

describe('Inbox', () => {
  let component: Inbox;
  let fixture: ComponentFixture<Inbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Inbox,
        TranslateModule.forRoot()
      ],
      providers: [MessagingStore],
    }).compileComponents();

    fixture = TestBed.createComponent(Inbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
