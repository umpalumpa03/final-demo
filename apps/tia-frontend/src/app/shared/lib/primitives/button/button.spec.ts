import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button'

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();
  });

  it('should render the native button with correct class', () => {
    fixture.componentRef.setInput('variant', 'default');
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList).toContain('button--default');
  });
});