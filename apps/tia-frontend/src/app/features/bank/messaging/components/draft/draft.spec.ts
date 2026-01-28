import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Draft } from './draft';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';

describe('Draft', () => {
  let component: Draft;
  let fixture: ComponentFixture<Draft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Draft,
        TranslateModule.forRoot()
      ],
      providers: [MessagingStore],
    }).compileComponents();

    fixture = TestBed.createComponent(Draft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
