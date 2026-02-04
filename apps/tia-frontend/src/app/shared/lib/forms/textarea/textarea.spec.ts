import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Textarea } from './textarea';
import { By } from '@angular/platform-browser';
import { Renderer2 } from '@angular/core';

describe('Textarea', () => {
  let component: Textarea;
  let fixture: ComponentFixture<Textarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textarea],
      providers: [Renderer2],
    }).compileComponents();

    fixture = TestBed.createComponent(Textarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value and adjust height on input (handleInput)', () => {
    const textareaEl = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;

    Object.defineProperty(textareaEl, 'scrollHeight', {
      configurable: true,
      value: 100,
    });

    const mockValue = 'Test input value';
    textareaEl.value = mockValue;

    const event = new Event('input');
    textareaEl.dispatchEvent(event);

    fixture.detectChanges();

    expect(component['value']()).toBe(mockValue);
    expect(textareaEl.style.height).toBe('10rem');
  });
});
