import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LargeDialog } from './large-dialog';

describe('LargeDialog', () => {
  let component: LargeDialog;
  let fixture: ComponentFixture<LargeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LargeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
