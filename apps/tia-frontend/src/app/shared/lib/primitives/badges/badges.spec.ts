import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Badges } from './badges';

describe('Badges', () => {
  let component: Badges;
  let fixture: ComponentFixture<Badges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badges],
    }).compileComponents();

    fixture = TestBed.createComponent(Badges);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return empty iconAlt when status is not provided', () => {
    fixture.detectChanges();

    const iconAlt = (component as any).iconAlt();
    expect(iconAlt).toBe('');
  });

  it('should return correct iconAlt when status is provided', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.detectChanges();

    const iconAlt = (component as any).iconAlt();
    expect(iconAlt).toBe('Active status icon');
  });

  it('should apply size class when size is provided', () => {
    fixture.componentRef.setInput('size', 'medium');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--medium');
  });

  it('should default to small size', () => {
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--small');
  });
});
