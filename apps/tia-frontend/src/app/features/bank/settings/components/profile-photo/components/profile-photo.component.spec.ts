import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePhotoComponent } from './profile-photo.component';

describe('ProfilePhotoComponent', () => {
  let component: ProfilePhotoComponent;
  let fixture: ComponentFixture<ProfilePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default initials set to "JD"', () => {
    expect(component.initials()).toBe('JD');
  });

  it('should render avatar in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const avatarElement = compiled.querySelector('app-avatar');

    expect(avatarElement).toBeTruthy();
  });

  it('should render basic card in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cardElement = compiled.querySelector('app-basic-card');

    expect(cardElement).toBeTruthy();
  });

  it('should handle file change with a FileList-like object', () => {
    const file = new File(['content'], 'avatar.png', { type: 'image/png' });

    const fileListLike: any = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    };

    if (typeof FileList !== 'undefined') {
      Object.setPrototypeOf(fileListLike, FileList.prototype);
    }

    expect(() =>
      component.onFileChange(fileListLike as FileList),
    ).not.toThrow();
  });
});
