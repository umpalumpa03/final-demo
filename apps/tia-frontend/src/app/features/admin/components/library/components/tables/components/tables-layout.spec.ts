import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablesLayout } from './tables-layout';

describe('TablesLayout', () => {
  let component: TablesLayout;
  let fixture: ComponentFixture<TablesLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TablesLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
