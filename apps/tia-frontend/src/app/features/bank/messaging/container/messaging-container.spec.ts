import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagingContainer } from './messaging-container';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
