import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommandPalette } from './ui-command-palette';

describe('UiCommandPalette', () => {
  let component: UiCommandPalette;
  let fixture: ComponentFixture<UiCommandPalette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCommandPalette],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCommandPalette);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
