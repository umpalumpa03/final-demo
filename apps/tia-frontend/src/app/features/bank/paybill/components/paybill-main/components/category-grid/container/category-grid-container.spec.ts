import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGridContainer } from './category-grid-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { vi } from 'vitest';

describe('CategoryGridContainer', () => {
  let component: CategoryGridContainer;
  let fixture: ComponentFixture<CategoryGridContainer>;

  const mockPaybillMainFacade = {
    formattedCategories: vi.fn(() => []),
    isLoading: vi.fn(() => false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryGridContainer],
      providers: [
        { provide: PaybillMainFacade, useValue: mockPaybillMainFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryGridContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade methods on template render', () => {
    expect(mockPaybillMainFacade.formattedCategories).toHaveBeenCalled();
    expect(mockPaybillMainFacade.isLoading).toHaveBeenCalled();
  });

  it('should display the grid when not loading', () => {
    mockPaybillMainFacade.isLoading.mockReturnValue(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-category-grid')).toBeTruthy();
  });
});
