import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<button app-button [variant]="variant" [isLoading]="isLoading">Test Button</button>`
})
class TestHostComponent {
  variant: any = 'default';
  isLoading = false;
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the button component', () => {
    const buttonDebugElement = fixture.nativeElement.querySelector('button');
    expect(buttonDebugElement).toBeTruthy();
  });

  it('should apply variant classes correctly', async () => {
    component.variant = 'destructive';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges(); 

    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList).toContain('tia-btn--destructive');
  });

  it('should show spinner when isLoading is true', async () => {
    component.isLoading = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.tia-btn__spinner');
    expect(spinner).toBeTruthy();
    
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList).toContain('tia-btn--loading');
  });

  it('should disable the button when isLoading is true', async () => {
    component.isLoading = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTruthy();
  });
});