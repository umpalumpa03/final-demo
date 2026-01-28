import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accounts } from './accounts';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accounts],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
