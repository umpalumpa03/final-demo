import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { DeleteAccountDialog } from './delete-account-dialog';

describe('DeleteAccountDialog', () => {
  let component: DeleteAccountDialog;
  let fixture: ComponentFixture<DeleteAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccountDialog, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccountDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });
});
