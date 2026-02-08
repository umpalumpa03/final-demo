import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination-component';
import { TranslateModule } from '@ngx-translate/core';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentItems on default page change', () => {
    component.onDefaultPageChange(2);
    expect(component.defaultCurrentPage()).toBe(2);
    expect(component.currentItems()[0].id).toBe(11);
    expect(component.currentItems().length).toBe(10);
  });

  it('should update ellipsisItems on ellipsis page change', () => {
    component.onEllipsisPageChange(5);
    expect(component.ellipsisCurrentPage()).toBe(5);
    expect(component.ellipsisItems()[0].id).toBe(41);
    expect(component.ellipsisItems().length).toBe(10);
  });
});
