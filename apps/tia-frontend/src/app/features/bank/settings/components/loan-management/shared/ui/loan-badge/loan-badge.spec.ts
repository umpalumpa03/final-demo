import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanBadge } from './loan-badge';

describe('LoanBadge', () => {
  let component: LoanBadge;
  let fixture: ComponentFixture<LoanBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Pending');
    fixture.detectChanges();
  });

  it('should create with default inputs', () => {
    expect(component).toBeTruthy();
    expect(component.text()).toBe('Pending');
    expect(component.variant()).toBe('pending');
    expect(component.icon()).toBe('');
    expect(component.size()).toBe('small');
  });

  it('badgeClass should combine size and variant classes correctly for all variants', () => {
    expect(component.badgeClass()).toBe('loan-badge loan-badge--small loan-badge--pending');

    fixture.componentRef.setInput('variant', 'approved');
    fixture.componentRef.setInput('size', 'medium');
    fixture.detectChanges();
    expect(component.badgeClass()).toBe('loan-badge loan-badge--medium loan-badge--approved');

    fixture.componentRef.setInput('variant', 'declined');
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    expect(component.badgeClass()).toBe('loan-badge loan-badge--small loan-badge--declined');

    fixture.componentRef.setInput('variant', 'excellent');
    fixture.detectChanges();
    expect(component.badgeClass()).toBe('loan-badge loan-badge--small loan-badge--excellent');
  });

  it('should render icon img when icon input is provided', () => {
    fixture.componentRef.setInput('icon', 'images/svg/feature-loans/pending.svg');
    fixture.detectChanges();

    const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.src).toContain('pending.svg');
    expect(img?.alt).toBe('Pending');
  });

  it('should not render icon img when icon input is empty', () => {
    fixture.componentRef.setInput('icon', '');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
  });

  it('should render text content in the span', () => {
    fixture.componentRef.setInput('text', 'Approved');
    fixture.detectChanges();

    const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.trim()).toContain('Approved');
  });
});
