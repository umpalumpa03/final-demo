import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderNotifications } from './header-notifications';

describe('HeaderNotifications', () => {
  let component: HeaderNotifications;
  let fixture: ComponentFixture<HeaderNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNotifications],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
