import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OceanblueTheme } from './oceanblue-theme';

describe('OceanblueTheme', () => {
  let component: OceanblueTheme;
  let fixture: ComponentFixture<OceanblueTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OceanblueTheme],
    }).compileComponents();

    fixture = TestBed.createComponent(OceanblueTheme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
