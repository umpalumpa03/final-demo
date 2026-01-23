import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiContext } from './ui-context';

describe('UiContext', () => {
  let component: UiContext;
  let fixture: ComponentFixture<UiContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiContext],
    }).compileComponents();

    fixture = TestBed.createComponent(UiContext);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
