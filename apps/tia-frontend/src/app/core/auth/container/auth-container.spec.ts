import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthContainer } from './auth-container';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

describe('AuthContainer Component', () => {
  let component: AuthContainer;
  let fixture: ComponentFixture<AuthContainer>;
  let routerMock: {
    url: string;
    events: Subject<any>;
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    const eventsSubject = new Subject();

    routerMock = {
      url: '/auth/sign-in',
      events: eventsSubject,
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AuthContainer, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerMock },
        TranslateService,
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthContainer);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update side panel data on init', () => {
    routerMock.url = '/auth/sign-in';
    
    component.ngOnInit();

    expect(component.sidePanelData()).not.toBeNull();
  });

  it('should update side panel data on NavigationEnd event', () => {
    component.ngOnInit();

    const navigationEndEvent = new NavigationEnd(
      1,
      '/auth/sign-up',
      '/auth/sign-up'
    );

    routerMock.events.next(navigationEndEvent);

    expect(component.sidePanelData()).not.toBeNull();
  });
});