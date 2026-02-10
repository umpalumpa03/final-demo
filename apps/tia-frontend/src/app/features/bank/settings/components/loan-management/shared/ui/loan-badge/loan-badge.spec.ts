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

  it('badgeClass should combine size and variant classes correctly', () => {
    expect(component.badgeClass()).toBe('loan-badge loan-badge--small loan-badge--pending');

    fixture.componentRef.setInput('variant', 'approved');
    fixture.componentRef.setInput('size', 'medium');
    fixture.detectChanges();
    expect(component.badgeClass()).toBe('loan-badge loan-badge--medium loan-badge--approved');
  });

  it('should render icon img when icon input is provided', () => {
    fixture.componentRef.setInput('icon', 'images/svg/feature-loans/pending.svg');
    fixture.detectChanges();

    const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.alt).toBe('Pending');
  });
});
