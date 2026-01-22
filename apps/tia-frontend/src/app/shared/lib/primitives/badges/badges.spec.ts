import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should apply provided variant to class', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--secondary');
  });

  it('should render provided text', () => {
    fixture.componentRef.setInput('text', 'Test badge');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el.textContent ?? '').toContain('Test badge');
  });

  it('should apply status class when status is provided', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--active');
  });

  it('should render status icon when status is provided', () => {
    fixture.componentRef.setInput('status', 'pending');
    fixture.detectChanges();

    const icon: HTMLImageElement | null = fixture.nativeElement.querySelector('.badge__icon');
    expect(icon).not.toBeNull();
    expect(icon?.src).toContain('images/svg/badges/badges-pending.svg');
  });

  it('should return empty iconPath when status is not provided', () => {
    
    fixture.detectChanges();

   
    const iconPath = (component as any).iconPath();
    expect(iconPath).toBe('');
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
