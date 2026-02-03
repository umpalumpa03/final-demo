import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridLayout } from './grid-layout';
import {
  InitialColsValue,
  InitialGapValue,
} from '../config/grid-layout.config';

describe('GridLayout', () => {
  let component: GridLayout;
  let fixture: ComponentFixture<GridLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(GridLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default columns and gap', () => {
    expect(component.cols()).toBe(InitialColsValue);
    expect(component.gap()).toBe(InitialGapValue);
  });

  it('should update columns and gap when inputs change', () => {
    fixture.componentRef.setInput('cols', '4');
    fixture.componentRef.setInput('gap', '2rem');

    fixture.detectChanges();

    expect(component.cols()).toBe('4');
    expect(component.gap()).toBe('2rem');
  });

  it('should compute columnsStyle correctly based on cols input', () => {
    fixture.componentRef.setInput('cols', '2');
    fixture.detectChanges();


    expect(component.columnsStyle()).toBeDefined();
  });
});
