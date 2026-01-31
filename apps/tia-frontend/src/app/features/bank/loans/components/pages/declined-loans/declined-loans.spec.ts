import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclinedLoans } from './declined-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('DeclinedLoans', () => {
  let component: DeclinedLoans;
  let fixture: ComponentFixture<DeclinedLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;

  beforeEach(async () => {
    loansStoreMock = {
      loansWithAccountInfo: signal([]),
      loadLoans: vi.fn(),
      renameLoan: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DeclinedLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

    fixture = TestBed.createComponent(DeclinedLoans);
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
