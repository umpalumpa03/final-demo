import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackNavigation } from './back-navigation';

describe('BackNavigation', () => {
  let component: BackNavigation;
  let fixture: ComponentFixture<BackNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(BackNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
