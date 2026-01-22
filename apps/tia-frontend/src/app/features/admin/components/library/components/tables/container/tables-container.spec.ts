import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablesContainer } from './tables-container';

describe('TablesContainer', () => {
  let component: TablesContainer;
  let fixture: ComponentFixture<TablesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(TablesContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
