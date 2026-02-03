import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGridContainer } from './category-grid-container';

describe('CategoryGridContainer', () => {
  let component: CategoryGridContainer;
  let fixture: ComponentFixture<CategoryGridContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryGridContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryGridContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
