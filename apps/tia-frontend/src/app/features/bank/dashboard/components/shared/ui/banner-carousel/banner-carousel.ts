import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { BannerSlide } from '../../models/banner.model';

@Component({
  selector: 'app-banner-carousel',
  imports: [],
  templateUrl: './banner-carousel.html',
  styleUrl: './banner-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerCarousel {
  private readonly router = inject(Router);
  public readonly slides = input.required<BannerSlide[]>();
  protected readonly currentIndex = signal(0);
}
