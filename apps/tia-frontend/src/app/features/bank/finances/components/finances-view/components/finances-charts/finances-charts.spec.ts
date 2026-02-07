import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesCharts } from './finances-charts';
import { By } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('FinancesCharts', () => {
  let component: FinancesCharts;
  let fixture: ComponentFixture<FinancesCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesCharts],
      providers: [provideCharts(withDefaultRegisterables())]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesCharts);
    component = fixture.componentInstance;
  });


  it('should render Income vs Expenses footer when data is provided', () => {
    const mockCharts = [{ title: 'Income vs Expenses', type: 'line', data: { labels: [], datasets: [] } }];
    const mockFooter = { income: '$5000', expenses: '$3000', net: '$2000', isNetPositive: true };

    fixture.componentRef.setInput('charts', mockCharts);
    fixture.componentRef.setInput('incomeVsExpensesFooter', mockFooter);
    fixture.detectChanges();

    const footer = fixture.debugElement.query(By.css('.income'));
    expect(footer.nativeElement.textContent).toContain('$5000');
    const net = fixture.debugElement.query(By.css('.net-value'));
    expect(net.nativeElement.classList).toContain('positive');
  });

  it('should render Top Categories footer', () => {
    const mockCharts = [{ title: 'Spending by Category', type: 'pie', data: { labels: [], datasets: [] } }];
    const mockCats = [{ category: 'Food', formattedAmount: '$200', color: 'red' }];

    fixture.componentRef.setInput('charts', mockCharts);
    fixture.componentRef.setInput('topCategoriesFooter', mockCats);
    fixture.detectChanges();

    const catName = fixture.debugElement.query(By.css('.cat-name'));
    expect(catName.nativeElement.textContent).toBe('Food');
  });

  it('should render Savings Trend footer', () => {
    const mockCharts = [{ title: 'Savings Trend', type: 'bar', data: { labels: [], datasets: [] } }];
    const mockSavings = { current: '$1000', average: '$800', period: 6 };

    fixture.componentRef.setInput('charts', mockCharts);
    fixture.componentRef.setInput('savingsFooter', mockSavings);
    fixture.detectChanges();

    const stats = fixture.debugElement.queryAll(By.css('.stat-value'));
    expect(stats[0].nativeElement.textContent).toBe('$1000');
    expect(stats[1].nativeElement.textContent).toBe('$800');
  });

  it('should render Daily Spending footer', () => {
    const mockCharts = [{ title: 'Daily Spending', type: 'line', data: { labels: [], datasets: [] } }];
    const mockDaily = { average: '$50', highest: '$120', lowest: '$10' };

    fixture.componentRef.setInput('charts', mockCharts);
    fixture.componentRef.setInput('dailySpendingFooter', mockDaily);
    fixture.detectChanges();

    const values = fixture.debugElement.queryAll(By.css('.stat-value'));
    expect(values[0].nativeElement.textContent).toBe('$50');
    expect(values[1].nativeElement.textContent).toBe('$120');
    expect(values[2].nativeElement.textContent).toBe('$10');
  });

  it('should show spinner when chart data is missing', () => {
    fixture.componentRef.setInput('charts', [{ title: 'Empty', type: 'line', data: null }]);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('app-spinner'));
    expect(spinner).toBeTruthy();
  });
});