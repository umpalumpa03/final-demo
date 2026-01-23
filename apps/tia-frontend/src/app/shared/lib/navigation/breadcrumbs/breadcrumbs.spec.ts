import { describe, it, expect, beforeEach } from 'vitest';
import { Breadcrumbs } from './breadcrumbs';
import type { Breadcrumb } from '../models/breadcrumbs.model';
import { TestBed } from '@angular/core/testing';

describe('Breadcrumbs (vitest)', () => {
  let component: Breadcrumbs;

  const mockCrumbs: Breadcrumb[] = [
    { label: 'Home', route: '/home' },
    { label: 'Library', route: '/library', icon: 'icon.svg' },
    { label: 'Details', route: '/details' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumbs],
    }).compileComponents();

    const fixture = TestBed.createComponent(Breadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have breadcrumbs input signal', () => {
    expect(component.breadcrumbs).toBeDefined();
    expect(typeof component.breadcrumbs).toBe('function');
  });

  it('should return the last breadcrumb with lastCrumb()', () => {
    const spy = vi.spyOn(component, 'breadcrumbs').mockReturnValue(mockCrumbs);
    const last = (component as any)['lastCrumb']();
    expect(last).toEqual(mockCrumbs[mockCrumbs.length - 1]);
    spy.mockRestore();
  });

});