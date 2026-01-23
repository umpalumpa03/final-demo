import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeparatorH } from './separator-h/separator';

describe('SeparatorH', () => {
  let component: SeparatorH;
  let fixture: ComponentFixture<SeparatorH>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparatorH],
    }).compileComponents();

    fixture = TestBed.createComponent(SeparatorH);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
