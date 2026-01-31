import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingLoans } from './pending-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('PendingLoans', () => {
  let component: PendingLoans;
  let fixture: ComponentFixture<PendingLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;

  beforeEach(async () => {
    loansStoreMock = {
      loansWithAccountInfo: signal([]),
      loadLoans: vi.fn(),
      renameLoan: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PendingLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

    fixture = TestBed.createComponent(PendingLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call renameLoan', () => {
    const event = { id: '1', name: 'New' };
    component.onRenameLoan(event);
    expect(loansStoreMock.renameLoan).toHaveBeenCalledWith(event);
  });
});
