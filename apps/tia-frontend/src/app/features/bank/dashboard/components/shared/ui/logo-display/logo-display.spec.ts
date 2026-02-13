import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoDisplay } from './logo-display';

describe('LogoDisplay', () => {
  let component: LogoDisplay;
  let fixture: ComponentFixture<LogoDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
