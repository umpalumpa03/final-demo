import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorizontalNavBar } from './horizontal-nav-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HORIZONTALNAVBARS } from '../../config/tabs-data';

describe('HorizontalNavBar', () => {
  let component: HorizontalNavBar;
  let fixture: ComponentFixture<HorizontalNavBar>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalNavBar, RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalNavBar);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translateService.use('ka');

    expect(component.activeHorizontal()).toEqual(translateService.instant('storybook.navigation.sections.horizontalNavigation.dashboard'));
    expect(component.horizontalItems()).toEqual(HORIZONTALNAVBARS(translateService));
  });

});
