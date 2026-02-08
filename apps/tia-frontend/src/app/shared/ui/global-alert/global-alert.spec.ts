import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GlobalAlert } from './global-alert';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AlertType, AlertVariant } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { provideTranslateService } from '@ngx-translate/core';

describe('GlobalAlert', () => {
  let component: GlobalAlert;
  let fixture: ComponentFixture<GlobalAlert>;

  const isVisible = signal(false);
  const alertType = signal<AlertType | null>(null);
  const alertMessage = signal('');
  const alertTitle = signal('');
  const alertVariant = signal<AlertVariant>('standard');

  const mockAlertService = {
    isVisible: isVisible.asReadonly(),
    alertType: alertType.asReadonly(),
    alertMessage: alertMessage.asReadonly(),
    alertTitle: alertTitle.asReadonly(),
    alertVariant: alertVariant.asReadonly(),
    clearAlert: vi.fn(),
  };

  beforeEach(async () => {
    isVisible.set(false);
    alertType.set(null);
    alertMessage.set('');
    alertTitle.set('');
    alertVariant.set('standard');
    mockAlertService.clearAlert.mockClear();

    await TestBed.configureTestingModule({
      imports: [GlobalAlert],
      providers: [
        provideTranslateService(),
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render alert when not visible', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.global-alert')).toBeNull();
  });

  it('should render dismissible alert when variant is dismissible', () => {
    isVisible.set(true);
    alertType.set('error');
    alertVariant.set('dismissible');
    alertTitle.set('Oops!');
    alertMessage.set('Failed');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.global-alert')).toBeTruthy();
    expect(el.querySelector('app-dismissible-alerts')).toBeTruthy();
    expect(el.querySelector('app-alert-types-with-icons')).toBeNull();
  });
});
