import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveCardsContainer } from './approve-cards-container';
import { ApproveCardsState } from '../shared/state/approve-cards.state';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ApproveCardsContainer', () => {
  let component: ApproveCardsContainer;
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let stateMock: any;
  let storeMock: any;

  beforeEach(async () => {
    stateMock = {
      newConfig: vi.fn(() => ({
        alertMessages: {
          successDesc: 'Success',
          errorDesc: 'Error'
        }
      })),
    };

    storeMock = {
      cards: signal([]),
      isLoading: signal(false),
      error: signal(null),
      success: signal(null),
      permissions: signal([]),
      count: signal(0),
      load: vi.fn(),
      loadPerrmisions: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ApproveCardsContainer],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(ApproveCardsContainer, {
      set: {
        providers: [
          { provide: ApproveCardsState, useValue: stateMock },
          { provide: ApproveCardsStore, useValue: storeMock }
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
    expect(component.userState).toEqual(stateMock);
  });
});