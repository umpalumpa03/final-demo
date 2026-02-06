import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private readonly router = inject(Router);

    private readonly currentUrl = signal<string | null>(null);
    private readonly previousUrl = signal<string | null>(null);

    public readonly current = computed(() => this.currentUrl());
    public readonly previous = computed(() => this.previousUrl());

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
