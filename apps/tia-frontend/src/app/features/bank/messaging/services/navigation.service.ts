import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private router = inject(Router);

    private currentUrl = signal<string | null>(null);
    private previousUrl = signal<string | null>(null);

    readonly current = computed(() => this.currentUrl());
    readonly previous = computed(() => this.previousUrl());

    constructor() {
        this.currentUrl.set(this.router.url);

        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe(event => {
                this.previousUrl.set(this.currentUrl());
                this.currentUrl.set(event.urlAfterRedirects);
            });
    }
}
