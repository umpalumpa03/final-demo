import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePhotoComponent } from './profile-photo.component';
import { vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('ProfilePhotoComponent', () => {
  let component: ProfilePhotoComponent;
  let fixture: ComponentFixture<ProfilePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should emit openUploadModal when file button is clicked', () => {
    const emitSpy = vi.spyOn(component.openUploadModal, 'emit');

    component.onFileButtonClick();

    expect(emitSpy).toHaveBeenCalled();
  });
});
