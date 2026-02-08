import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeName } from './change-name';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ChangeName', () => {
  let component: ChangeName;
  let fixture: ComponentFixture<ChangeName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangeName,
        TranslateModule.forRoot()
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeName);

    // set the required input before change detection
    fixture.componentRef.setInput('isOpen', false);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit submit when form has value', () => {
    const spy = vi.spyOn(component.submit, 'emit');
    component.nameForm.patchValue({ name: 'New Name' });
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith('New Name');
  });

  it('should reset and emit close on onClose', () => {
    const spy = vi.spyOn(component.close, 'emit');
    component.nameForm.patchValue({ name: 'Will be reset' });
    component.onClose();
    // reset may set value to null
    expect(component.nameForm.get('name')?.value).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});