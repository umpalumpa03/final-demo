import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LargeDialog } from './large-dialog';

describe('LargeDialog', () => {
  let component: LargeDialog;
  let fixture: ComponentFixture<LargeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LargeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggle when the main trigger button is clicked', () => {
    const triggerBtn = fixture.debugElement.query(By.css('.btn--outline'));

    triggerBtn.triggerEventHandler('click', null);

    expect(component.isOpen()).toBe(true);
  });
});
