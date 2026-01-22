import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatars } from './avatars';
import { Avatar } from '../../../../../../shared/lib/data-display/avatars/avatar';
import { AvatarGroup } from '../../../../../../shared/lib/data-display/avatars/avatar-groups/avatar-group';
import { LibraryTitle } from '../../shared/library-title/library-title';

describe('Avatars', () => {
  let component: Avatars;
  let fixture: ComponentFixture<Avatars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatars, Avatar, AvatarGroup, LibraryTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have page title and subtitle', () => {
    expect(component.pageTitle).toBe('Avatars');
    expect(component.pageSubtitle).toBe('Sizes, initials, colors, groups, and status indicators');
  });

  it('should expose sizes for the demo', () => {
    const sizes = component.sizes();
    expect(sizes.length).toBe(5);
    expect(sizes[0].label).toBe('XS');
  });

  it('should compute initials for the logged in user', () => {
    expect(component.loggedInInitials()).toBe('NM');
  });

  it('should render section labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('.avatars__label');
    expect(labels.length).toBe(5);
  });

  it('should render a group of avatars', () => {
    const group = fixture.nativeElement.querySelector('app-avatar-group');
    expect(group).toBeTruthy();
  });
});
