import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  let component: Skeleton;
  let fixture: ComponentFixture<Skeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(Skeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default width as 100%', () => {
    expect(component.width()).toBe('100%');
  });

  it('should have default height as 2rem', () => {
    expect(component.height()).toBe('2rem');
  });

  it('should have default variant as text', () => {
    expect(component.variant()).toBe('text');
  });

  it('should compute correct classes for text variant', () => {
    expect(component.classes()).toBe('skeleton skeleton--text');
  });

  it('should compute correct classes for circle variant', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.detectChanges();
    expect(component.classes()).toBe('skeleton skeleton--circle');
  });

  it('should return width for computedWidth when variant is text', () => {
    fixture.componentRef.setInput('width', '10rem');
    fixture.detectChanges();
    expect(component.computedWidth()).toBe('10rem');
  });

  it('should return height for computedWidth when variant is circle', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.componentRef.setInput('height', '5rem');
    fixture.detectChanges();
    expect(component.computedWidth()).toBe('5rem');
  });

  it('should return height for computedHeight', () => {
    fixture.componentRef.setInput('height', '3rem');
    fixture.detectChanges();
    expect(component.computedHeight()).toBe('3rem');
  });
});
