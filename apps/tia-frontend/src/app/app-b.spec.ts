import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppB } from './app-b';

describe('AppB Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppB],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppB);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});