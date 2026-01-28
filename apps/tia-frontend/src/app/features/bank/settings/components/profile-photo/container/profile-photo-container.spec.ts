import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ProfilePhotoContainer } from './profile-photo-container';

describe('ProfilePhotoContainer', () => {
  let component: ProfilePhotoContainer;
  let fixture: ComponentFixture<ProfilePhotoContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoContainer],
      providers: [
        provideMockStore({
          initialState: {
            ProfilePhoto: {
              defaultAvatars: [],
              selectedAvatarId: null,
              uploadedFileName: null,
              currentAvatarUrl: null,
              avatarId: null,
              avatarType: null,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
