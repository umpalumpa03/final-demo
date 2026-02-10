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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
