import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerCarousel } from './banner-carousel';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('BannerCarousel', () => {
  let component: BannerCarousel;
  let fixture: ComponentFixture<BannerCarousel>;
  let mockRouter: any;

  const mockSlides = [
    {
      title: 'Slide 1',
      description: 'Desc 1',
      buttonText: 'Click 1',
      link: '/link1',
      image: 'img1.jpg',
    },
    {
      title: 'Slide 2',
      description: 'Desc 2',
      buttonText: 'Click 2',
      link: '/link2',
      image: 'img2.jpg',
    },
    {
      title: 'Slide 3',
      description: 'Desc 3',
      buttonText: 'Click 3',
      link: '/link3',
      image: 'img3.jpg',
    },
  ];

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BannerCarousel, TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerCarousel);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('slides', mockSlides);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation Logic', () => {
    it('should move to the next slide and wrap around', () => {
      expect(component['currentIndex']()).toBe(0);

      component['next']();
      expect(component['currentIndex']()).toBe(1);

      component['next']();
      expect(component['currentIndex']()).toBe(2);

      component['next']();
      expect(component['currentIndex']()).toBe(0);
    });

    it('should move to the previous slide and wrap around', () => {
      expect(component['currentIndex']()).toBe(0);

      component['prev']();
      expect(component['currentIndex']()).toBe(2);

      component['prev']();
      expect(component['currentIndex']()).toBe(1);
    });

    it('should go to a specific slide index', () => {
      component['goTo'](2);
      expect(component['currentIndex']()).toBe(2);
    });

    it('should navigate to a URL via router', () => {
      const testUrl = '/test-path';
      component['navigateTo'](testUrl);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(testUrl);
    });
  });
});
