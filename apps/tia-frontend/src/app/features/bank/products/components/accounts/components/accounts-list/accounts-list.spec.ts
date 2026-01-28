import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';
import { AccountsListComponent } from './accounts-list';

describe('AccountsListComponent', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
