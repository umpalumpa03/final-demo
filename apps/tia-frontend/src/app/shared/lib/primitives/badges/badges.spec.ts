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

  it('should apply pill shape class when shape is pill', () => {
    fixture.componentRef.setInput('shape', 'pill');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--pill');
  });

  it('should apply rounded shape class when shape is rounded', () => {
    fixture.componentRef.setInput('shape', 'rounded');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--rounded');
  });

  it('should render label when label is provided', () => {
    fixture.componentRef.setInput('label', 'Messages');
    fixture.detectChanges();

    const label: HTMLElement | null = fixture.nativeElement.querySelector('.badge-wrapper__label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Messages');
  });

  it('should not render label when label is not provided', () => {
    fixture.detectChanges();

    const label: HTMLElement | null = fixture.nativeElement.querySelector('.badge-wrapper__label');
    expect(label).toBeNull();
  });

  it('should hide icon when showIcon is false', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.componentRef.setInput('showIcon', false);
    fixture.detectChanges();

    const icon: HTMLImageElement | null = fixture.nativeElement.querySelector('.badge__icon');
    expect(icon).toBeNull();
  });

  it('should show icon when showIcon is true and status is provided', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.componentRef.setInput('showIcon', true);
    fixture.detectChanges();

    const icon: HTMLImageElement | null = fixture.nativeElement.querySelector('.badge__icon');
    expect(icon).toBeTruthy();
  });

  describe('Interactive Badges (Dismissible)', () => {
    it('should show dismiss button when dismissible is true', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.badge__dismiss');
      expect(dismissButton).toBeTruthy();
    });

    it('should not show dismiss button when dismissible is false', () => {
      fixture.componentRef.setInput('dismissible', false);
      fixture.detectChanges();

      const dismissButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.badge__dismiss');
      expect(dismissButton).toBeNull();
    });

    it('should not show dismiss button by default', () => {
      fixture.detectChanges();

      const dismissButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.badge__dismiss');
      expect(dismissButton).toBeNull();
    });

    it('should emit dismissed event when dismiss button is clicked', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.dismissed, 'emit');
      const dismissButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.badge__dismiss');
      
      expect(dismissButton).toBeTruthy();
      dismissButton?.click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should have correct aria-label on dismiss button', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.badge__dismiss');
      expect(dismissButton).toBeTruthy();
      expect(dismissButton?.getAttribute('aria-label')).toBe('Dismiss');
    });

    it('should render dismiss icon when dismissible is true', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissIcon: HTMLImageElement | null = fixture.nativeElement.querySelector('.badge__dismiss-icon');
      expect(dismissIcon).toBeTruthy();
      expect(dismissIcon?.src).toContain('images/svg/badges/badges-inactive.svg');
      expect(dismissIcon?.alt).toBe('Dismiss');
    });

    it('should have dismiss button with correct type', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.badge__dismiss');
      expect(dismissButton).toBeTruthy();
      expect(dismissButton?.type).toBe('button');
    });
  });
});
