import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { BannerSlide } from '../../models/banner.model';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-banner-carousel',
  imports: [ButtonComponent],
  templateUrl: './banner-carousel.html',
  styleUrl: './banner-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerCarousel {
  private readonly router = inject(Router);
  public readonly slides = input.required<BannerSlide[]>();
  protected readonly currentIndex = signal(0);

  protected goTo(index: number): void {
    this.currentIndex.set(index);
  }

  protected navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}
