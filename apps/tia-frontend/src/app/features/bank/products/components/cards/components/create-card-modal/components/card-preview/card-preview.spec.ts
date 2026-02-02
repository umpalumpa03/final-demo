import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CardPreview } from './card-preview';

describe('CardPreview', () => {
  let component: CardPreview;
  let fixture: ComponentFixture<CardPreview>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardPreview],
    });

    fixture = TestBed.createComponent(CardPreview);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isLoading', false);
  });

  it('should render with inputs', () => {
    fixture.componentRef.setInput('designUri', 'test-uri.jpg');
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.designUri()).toBe('test-uri.jpg');
  });
});