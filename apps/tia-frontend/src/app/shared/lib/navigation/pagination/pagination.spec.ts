import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';
import { PAGINATION_DEFAULT_CONFIG } from '../models/pagination.model';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show all pages when showEllipsis is false', () => {
    fixture.componentRef.setInput('config', { ...PAGINATION_DEFAULT_CONFIG, showEllipsis: false });
    fixture.detectChanges();
    expect(component.visiblePages()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should show ellipsis for large page sets', () => {
    fixture.componentRef.setInput('currentPage', 10);
    fixture.componentRef.setInput('totalPages', 20);
    fixture.componentRef.setInput('config', { ...PAGINATION_DEFAULT_CONFIG, showEllipsis: true, maxVisiblePages: 7 });
    fixture.detectChanges();
    const pages = component.visiblePages();
    expect(pages).toContain(component.ELLIPSIS);
    expect(pages[0]).toBe(1);
    expect(pages[pages.length - 1]).toBe(20);
  });

  it('should emit pageChange for valid page', () => {
    vi.spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();
    component.onPageChange(3);
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should not emit pageChange for invalid page', () => {
    vi.spyOn(component.pageChange, 'emit');
    component.onPageChange(1);
    component.onPageChange(0);
    component.onPageChange(component.ELLIPSIS);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
