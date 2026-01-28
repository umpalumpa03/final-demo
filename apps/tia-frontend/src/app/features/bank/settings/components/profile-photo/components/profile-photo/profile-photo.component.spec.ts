import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePhotoComponent } from './profile-photo.component';
import { vi } from 'vitest';

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

  it('should create file input and emit file when selected', () => {
    const file = new File(['content'], 'avatar.png', { type: 'image/png' });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as FileList;

    const emitSpy = vi.spyOn(component.fileSelected, 'emit');
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const clickSpy = vi.fn();
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    const mockInput = {
      type: '',
      accept: '',
      style: { display: '' },
      files: fileList,
      addEventListener: vi.fn((event, callback) => {
        if (event === 'change') {
      
          setTimeout(() => callback({ target: mockInput } as unknown as Event), 0);
        }
      }),
      click: clickSpy,
    } as unknown as HTMLInputElement;

    createElementSpy.mockReturnValue(mockInput);

    component.onFileButtonClick();

    expect(createElementSpy).toHaveBeenCalledWith('input');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    
  
    const changeCallback = (mockInput.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(
      (call: any[]) => call[0] === 'change'
    )?.[1];
    
    if (changeCallback) {
      changeCallback({ target: mockInput } as unknown as Event);
      expect(emitSpy).toHaveBeenCalledWith(file);
      expect(removeChildSpy).toHaveBeenCalledWith(mockInput);
    }
  });
});
