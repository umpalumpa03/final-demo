import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly EXTRA_SMALL_BREAKPOINT = 450;
  private readonly XS_MOBILE_BREAKPOINT = 550;
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;
  private readonly L_TABLET_BREAKPOINT = 1040;

  public isExtraSmall = signal(
    window.innerWidth <= this.EXTRA_SMALL_BREAKPOINT,
  );
  public isXsMobile = signal(window.innerWidth <= this.XS_MOBILE_BREAKPOINT);
  public isMobile = signal(window.innerWidth <= this.MOBILE_BREAKPOINT);
  public isTablet = signal(window.innerWidth <= this.TABLET_BREAKPOINT);
  public isLTablet = signal(window.innerWidth <= this.L_TABLET_BREAKPOINT);

  constructor() {
    window.addEventListener('resize', () => this.updateBreakpoints());
  }

  private updateBreakpoints(): void {
    const width = window.innerWidth;
    this.isExtraSmall.set(width <= this.EXTRA_SMALL_BREAKPOINT);
    this.isXsMobile.set(window.innerWidth <= this.XS_MOBILE_BREAKPOINT);
    this.isMobile.set(width <= this.MOBILE_BREAKPOINT);
    this.isTablet.set(width <= this.TABLET_BREAKPOINT);
    this.isLTablet.set(width <= this.L_TABLET_BREAKPOINT);
  }
}
