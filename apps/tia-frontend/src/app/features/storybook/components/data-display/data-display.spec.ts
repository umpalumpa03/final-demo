import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataDisplay } from './data-display';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { AspectRatio } from '@tia/shared/lib/data-display/aspect-ratio/aspect-ratio';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { AvatarGroup } from '@tia/shared/lib/data-display/avatars/avatar-groups/avatar-group';
import { HoverCard } from '@tia/shared/lib/data-display/hover-card/hover-card';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';

describe('DataDisplay', () => {
  let component: DataDisplay;
  let fixture: ComponentFixture<DataDisplay>;

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose page metadata', () => {
    expect(component.title).toBe('Data Display');
    expect(component.subtitle).toBe(
      'Avatars, aspect ratios, tooltips, and hover cards',
    );
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

  it('should manage aspect ratio selection state', () => {
    expect(component.selectedRatio()).toBeNull();
    expect(component.hasRatios()).toBe(true);

    const firstRatio = component.ratios()[0];
    component.onRatioSelected(firstRatio);
    expect(component.selectedRatio()).toEqual(firstRatio);

    component.ratios.set([]);
    expect(component.hasRatios()).toBe(false);
    expect(component.selectedRatio()).toBeNull();
  });
});
