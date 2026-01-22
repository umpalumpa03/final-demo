import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopSheetModal } from './top-sheet-modal';

describe('TopSheetModal', () => {
  let component: TopSheetModal;
  let fixture: ComponentFixture<TopSheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSheetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSheetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
