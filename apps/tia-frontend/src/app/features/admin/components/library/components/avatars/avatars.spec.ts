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
});
