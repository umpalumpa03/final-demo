import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCardViewComponent } from './account-card-view';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';

describe('AccountCardViewComponent', () => {
  let component: AccountCardViewComponent;
  let fixture: ComponentFixture<AccountCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardViewComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
