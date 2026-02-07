import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeButton } from './customize-button';

describe('CustomizeButton', () => {
  let component: CustomizeButton;
  let fixture: ComponentFixture<CustomizeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
