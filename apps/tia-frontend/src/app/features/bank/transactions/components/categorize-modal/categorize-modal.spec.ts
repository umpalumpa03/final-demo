import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorizeModal } from './categorize-modal';

describe('CategorizeModal', () => {
  let component: CategorizeModal;
  let fixture: ComponentFixture<CategorizeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorizeModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorizeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
