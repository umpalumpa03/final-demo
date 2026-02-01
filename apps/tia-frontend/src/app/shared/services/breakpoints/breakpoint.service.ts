import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  public isMobile = signal(window.innerWidth <= this.MOBILE_BREAKPOINT);
  public isTablet = signal(window.innerWidth <= this.TABLET_BREAKPOINT);

  constructor() {
    window.addEventListener('resize', () => this.updateBreakpoints());
  }

  private updateBreakpoints(): void {
    const width = window.innerWidth;
    this.isMobile.set(width <= this.MOBILE_BREAKPOINT);
    this.isTablet.set(width <= this.TABLET_BREAKPOINT);
  }
}
