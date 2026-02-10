import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataDisplay } from './data-display';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { AspectRatio } from '@tia/shared/lib/data-display/aspect-ratio/aspect-ratio';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { AvatarGroup } from '@tia/shared/lib/data-display/avatars/avatar-groups/avatar-group';
import { HoverCard } from '@tia/shared/lib/data-display/hover-card/hover-card';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DataDisplay', () => {
  let component: DataDisplay;
  let fixture: ComponentFixture<DataDisplay>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataDisplay,
        LibraryTitle,
        ShowcaseCard,
        Avatar,
        AvatarGroup,
        AspectRatio,
        Tooltip,
        HoverCard,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataDisplay);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render data display sections', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('app-library-title')).toBeTruthy();
    expect(element.querySelector('app-showcase-card')).toBeTruthy();
    expect(element.querySelector('app-avatar')).toBeTruthy();
    expect(element.querySelector('app-avatar-group')).toBeTruthy();
    expect(element.querySelector('app-aspect-ratio-list')).toBeTruthy();
    expect(element.querySelector('app-tooltip')).toBeTruthy();
    expect(element.querySelector('app-hover-card')).toBeTruthy();
  });

  it('onRatioSelected should set selectedRatioId and selectedRatio, and hasRatios should track ratios length', () => {
    expect(component.selectedRatio()).toBeNull();
    expect(component.hasRatios()).toBe(true);

    const firstRatio = component.ratios()[0];
    component.onRatioSelected(firstRatio);
    expect(component.selectedRatio()).toEqual(firstRatio);

    component.ratios.set([]);
    expect(component.hasRatios()).toBe(false);
    expect(component.selectedRatio()).toBeNull();
  });

  it('isChangeEmpty should return true for null, undefined, empty, and "no change", false otherwise', () => {
    expect(component.isChangeEmpty(null)).toBe(true);
    expect(component.isChangeEmpty(undefined)).toBe(true);
    expect(component.isChangeEmpty('')).toBe(true);
    expect(component.isChangeEmpty('No Change')).toBe(true);
    expect(component.isChangeEmpty('  no change  ')).toBe(true);
    expect(component.isChangeEmpty('+5.2%')).toBe(false);
    expect(component.isChangeEmpty('-3.1%')).toBe(false);
  });

  it('initialsUsers should combine loggedInUser and additionalUsers', () => {
    const users = component.initialsUsers();
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users[0]).toHaveProperty('firstName');
    expect(users[0]).toHaveProperty('lastName');
  });

  it('initialsAvatars should derive initials from user names', () => {
    const avatars = component.initialsAvatars();
    expect(avatars.length).toBeGreaterThanOrEqual(1);
    avatars.forEach((avatar) => {
      expect(avatar.initials).toBeDefined();
      expect(avatar.tone).toBe('soft');
      expect(avatar.color).toBe('blue');
    });
  });
});
