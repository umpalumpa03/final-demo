import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PillPaging } from './pill-paging';

describe('PillPaging', () => {
  let component: PillPaging;
  let fixture: ComponentFixture<PillPaging>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillPaging],
    }).compileComponents();

    fixture = TestBed.createComponent(PillPaging);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('total', 5);
    fixture.componentRef.setInput('currentIndex', 0);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute pageArray based on total input', () => {
    const pages = (component as any).pageArray();
    expect(pages.length).toBe(5);
  });
});
