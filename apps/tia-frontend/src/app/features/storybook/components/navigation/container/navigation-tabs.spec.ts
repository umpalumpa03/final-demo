import { Navigation } from './navigation-tabs';
import { BREADCRUMBS, BREADCRUMBS2, TABS, TABS2 } from '../config/tabs-data';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('Navigation', () => {
  let component: Navigation;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Navigation,
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update all signals when language changes', () => {
    component.ngOnInit();
    translateService.use('ka');

    expect(component.tabs()).toEqual(TABS(translateService));
    expect(component.tabs2()).toEqual(TABS2(translateService));
    expect(component.breadcrumbs()).toEqual(BREADCRUMBS(translateService));
    expect(component.breadcrumbs2()).toEqual(BREADCRUMBS2(translateService));
  });

});
