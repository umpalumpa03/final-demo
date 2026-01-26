import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePhotoContainer } from './profile-photo-container';

describe('ProfilePhotoContainer', () => {
  let component: ProfilePhotoContainer;
  let fixture: ComponentFixture<ProfilePhotoContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
