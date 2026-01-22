import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomActionCard } from './bottom-action-card';
import { describe, it, expect, beforeEach } from 'vitest';

describe('BottomActionCard', () => {
  let component: BottomActionCard;
  let fixture: ComponentFixture<BottomActionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomActionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomActionCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Test Action');
    fixture.componentRef.setInput('icon', 'new');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label from signal input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.action-card--label')?.textContent,
    ).toContain('Test Action');
  });
});
