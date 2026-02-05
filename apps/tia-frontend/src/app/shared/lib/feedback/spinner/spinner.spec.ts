import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Spinner', () => {
  let component: Spinner;
  let fixture: ComponentFixture<Spinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner],
    }).compileComponents();

    fixture = TestBed.createComponent(Spinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size as 40px', () => {
    expect(component.size()).toBe('40px');
  });

  it('should update size when input changes', () => {
    fixture.componentRef.setInput('size', '4rem');
    fixture.detectChanges();
    expect(component.size()).toBe('4rem');
  });

  it('should apply the size to the host style', () => {
    fixture.componentRef.setInput('size', '50px');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.spinner');
    expect(component.size()).toBe('50px');
  });
});
