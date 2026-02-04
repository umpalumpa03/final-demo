import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
    let service: NavigationService;
    let mockRouter: any;
    let routerEventsSubject: Subject<any>;

    beforeEach(() => {
        routerEventsSubject = new Subject();

        mockRouter = {
            url: '/initial-url',
            events: routerEventsSubject.asObservable()
        };

        TestBed.configureTestingModule({
            providers: [
                NavigationService,
                { provide: Router, useValue: mockRouter }
            ]
        });

        service = TestBed.inject(NavigationService);
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with current router URL', () => {
        expect(service.current()).toBe('/initial-url');
    });

    it('should initialize with null previous URL', () => {
        expect(service.previous()).toBeNull();
    });

    it('should update current and previous URLs on NavigationEnd', () => {
        const navigationEndEvent = new NavigationEnd(
            1,
            '/new-url',
            '/new-url'
        );

        routerEventsSubject.next(navigationEndEvent);

        expect(service.current()).toBe('/new-url');
        expect(service.previous()).toBe('/initial-url');
    });

});