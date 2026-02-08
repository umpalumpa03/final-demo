import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveCardsContainer } from './approve-cards-container';
import { ApproveCardsState } from '../shared/state/approve-cards.state';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('ApproveCardsContainer', () => {
  let component: ApproveCardsContainer;
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let stateMock: any;

  beforeEach(async () => {
    stateMock = {
      newConfig: vi.fn(() => ({})),
      cards: signal([]),
      isLoading: signal(false),
      error: signal(null),
      permissions: signal([])
    };

    await TestBed.configureTestingModule({
      imports: [ApproveCardsContainer],
    })
    .overrideComponent(ApproveCardsContainer, {
      set: {
        providers: [
          { provide: ApproveCardsState, useValue: stateMock }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveCardsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ApproveCardsState', () => {
    expect(component.userState).toBeDefined();
    expect(component.userState).toBe(stateMock);
  });
});