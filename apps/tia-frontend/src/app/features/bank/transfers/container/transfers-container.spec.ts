import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfersContainer } from './transfers-container';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TransfersContainer', () => {
  let component: TransfersContainer;
  let fixture: ComponentFixture<TransfersContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersContainer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have transferTabs', () => {
    expect(component.transferTabs()).toBeDefined();
  });
});
