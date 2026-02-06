import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesCharts } from './finances-charts';
import { By } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Spinner } from '../../../../../shared/lib/feedback/spinner/spinner';

describe('FinancesCharts', () => {
  let component: FinancesCharts;
  let fixture: ComponentFixture<FinancesCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesCharts, Spinner],
      providers: [
        provideCharts(withDefaultRegisterables())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesCharts);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render charts when data is provided', () => {
    const mockCharts = [
      { 
        title: 'Income vs Expenses', 
        type: 'line' as const, 
        data: { 
          labels: ['Jan'], 
          datasets: [{ data: [1000], label: 'Income' }] 
        } 
      }
    ];

    fixture.componentRef.setInput('charts', mockCharts);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.chart-title'));
    expect(title.nativeElement.textContent).toContain('Income vs Expenses');
    
    const canvas = fixture.debugElement.query(By.css('canvas'));
    expect(canvas).toBeTruthy();
  });

  it('should show spinner while chart data is null', () => {
    const mockCharts = [{ title: 'Loading...', type: 'pie' as const, data: null }];

    fixture.componentRef.setInput('charts', mockCharts);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('app-spinner'));
    expect(spinner).toBeTruthy();
    
    const canvas = fixture.debugElement.query(By.css('canvas'));
    expect(canvas).toBeNull();
  });

 
});