import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountCardComponent } from './account-card';

describe('Accounts', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
