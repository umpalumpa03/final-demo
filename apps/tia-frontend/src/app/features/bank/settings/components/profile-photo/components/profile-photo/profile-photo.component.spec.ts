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



  it('should create file input and emit file when selected', () => {
    const file = new File(['content'], 'avatar.png', { type: 'image/png' });
    const emitSpy = vi.spyOn(component.fileSelected, 'emit');

    component.onFileButtonClick();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as unknown as FileList;

    Object.defineProperty(input, 'files', {
      value: fileList,
      writable: false,
    });

    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(file);
    expect(document.body.contains(input)).toBe(false);
  });
});
