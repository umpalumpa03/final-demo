import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sent } from './sent';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';

describe('Sent', () => {
  let component: Sent;
  let fixture: ComponentFixture<Sent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Sent,
        TranslateModule.forRoot()
      ],
      providers: [MessagingStore],
    }).compileComponents();

    fixture = TestBed.createComponent(Sent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
