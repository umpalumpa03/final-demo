import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Feedback } from './feedback';
import {
  IMAGE_SKELETONS,
  LIST_ITEMS,
  LOADING_CARDS,
  TEXT_SKELETONS,
} from './config/feedback.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feedback', () => {
  let component: Feedback;
  let fixture: ComponentFixture<Feedback>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feedback, TranslateModule.forRoot()],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(Feedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh data when language changes', () => {
    const initialCards = component.loadingCards;
    const initialText = component.textSkeletons;

    translateService.use('ka');
    fixture.detectChanges();

    expect(component.loadingCards).not.toBe(initialCards);
    expect(component.textSkeletons).not.toBe(initialText);
    expect(component.loadingCards).toEqual(LOADING_CARDS);
  });

  it('should initialize data from config', () => {
    expect(component.loadingCards).toEqual(LOADING_CARDS);
    expect(component.textSkeletons).toEqual(TEXT_SKELETONS);
    expect(component.imageSkeletons).toEqual(IMAGE_SKELETONS);
    expect(component.listItems).toEqual(LIST_ITEMS);
  });

  it('should track items by id', () => {
    const result = component['trackById'](0, { id: 'test-id' });
    expect(result).toBe('test-id');
  });
});
