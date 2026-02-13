import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Overlay } from './overlay';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Overlay', () => {
  let component: Overlay;
  let fixture: ComponentFixture<Overlay>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overlay, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Overlay);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should render at least two showcase cards for dialogs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const showcaseCards = compiled.querySelectorAll('app-showcase-card');

    expect(showcaseCards.length).toBeGreaterThanOrEqual(2);
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');
    fixture.detectChanges();

    expect(component.pageTitle()).toBeDefined();
    expect(component.pageSubtitle()).toBeDefined();
    expect(component.sectionDialogs()).toBeDefined();
    expect(component.sectionAlertDialogs()).toBeDefined();
    expect(component.sectionSheets()).toBeDefined();
    expect(component.sectionDrawers()).toBeDefined();
    expect(component.sectionCommandPalette()).toBeDefined();
  });
});
