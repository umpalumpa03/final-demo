import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonLibraryComponent } from './button-library';

describe('ButtonLibraryComponent', () => {
  let component: ButtonLibraryComponent;
  let fixture: ComponentFixture<ButtonLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLibraryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state and data', () => {
    expect(component.title).toBe('Buttons');
    expect(component['variants']().length).toBeGreaterThan(0);
    expect(component['iconButtons']().length).toBeGreaterThan(0);
  });

  it('should start with loading as false', () => {
    expect(component['isInteractiveLoading']()).toBeFalsy();
  });

  it('should set loading to true when toggleLoading is called', () => {
    component['toggleLoading']();
    
    expect(component['isInteractiveLoading']()).toBeTruthy();
  });
});