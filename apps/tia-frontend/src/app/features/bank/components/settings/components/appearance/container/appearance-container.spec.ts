import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppearanceContainer } from './appearance-container';

describe('AppearanceContainer', () => {
  let component: AppearanceContainer;
  let fixture: ComponentFixture<AppearanceContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppearanceContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(AppearanceContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
