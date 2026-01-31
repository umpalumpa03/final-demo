import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VerifiedUserCard } from './verified-user-card';
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRef } from '@angular/core';

describe('VerifiedUserCard (vitest)', () => {
  let component: VerifiedUserCard;
  let fixture: ComponentFixture<VerifiedUserCard>;
  let componentRef: ComponentRef<VerifiedUserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiedUserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifiedUserCard);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('fullName', 'John Doe');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute initials for two names', () => {
    expect((component as any).initials()).toBe('JD');
  });

  it('should compute initials for more than two names using first and last', () => {
    componentRef.setInput('fullName', 'John Michael Doe');
    fixture.detectChanges();
    expect((component as any).initials()).toBe('JD');
  });

  it('should compute initials for a single name using first two letters', () => {
    componentRef.setInput('fullName', 'John');
    fixture.detectChanges();
    expect((component as any).initials()).toBe('JO');
  });

  it('should use default description if not provided', () => {
    expect(component.description()).toBe('Verified User');
  });

  it('should use provided description', () => {
    componentRef.setInput('description', 'Custom Description');
    fixture.detectChanges();
    expect(component.description()).toBe('Custom Description');
  });

  it('should handle name with extra spaces', () => {
    componentRef.setInput('fullName', '  jane   smith  ');
    fixture.detectChanges();
    expect((component as any).initials()).toBe('JS');
  });
});
