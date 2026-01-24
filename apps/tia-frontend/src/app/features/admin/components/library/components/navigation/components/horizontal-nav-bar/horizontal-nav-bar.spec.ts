import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorizontalNavBar } from './horizontal-nav-bar';
import { RouterModule } from '@angular/router';

describe('HorizontalNavBar', () => {
  let component: HorizontalNavBar;
  let fixture: ComponentFixture<HorizontalNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalNavBar, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalNavBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
