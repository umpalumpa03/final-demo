import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDrawer } from './ui-drawer';
import { By } from '@angular/platform-browser';

describe('UiDrawer', () => {
  let component: UiDrawer;
  let fixture: ComponentFixture<UiDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
