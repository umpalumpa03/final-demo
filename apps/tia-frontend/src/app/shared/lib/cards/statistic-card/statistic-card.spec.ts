import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticCard } from './statistic-card';

describe('StatisticCard', () => {
  let component: StatisticCard;
  let fixture: ComponentFixture<StatisticCard>;

  const setDefaultInputs = (overrides?: {
    label?: string;
    value?: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon?: string;
  }) => {
    fixture.componentRef.setInput('label', overrides?.label ?? 'Test');
    fixture.componentRef.setInput('value', overrides?.value ?? '100');
    fixture.componentRef.setInput('change', overrides?.change ?? '+10%');
    fixture.componentRef.setInput(
      'changeType',
      overrides?.changeType ?? 'positive',
    );
    fixture.componentRef.setInput(
      'icon',
      overrides?.icon ?? 'images/svg/cards/dolar.svg',
    );
    fixture.detectChanges();
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticCard);
    component = fixture.componentInstance;
  });

  it('should render label', () => {
    setDefaultInputs({ label: 'Total Revenue' });

    const label = fixture.nativeElement.querySelector('.statistic-card__label');
    expect(label.textContent).toBe('Total Revenue');
  });

  it('should render icon', () => {
    setDefaultInputs({ icon: 'images/svg/cards/dolar.svg' });

    const icon = fixture.nativeElement.querySelector('.statistic-card__icon');
    expect(icon.tagName).toBe('IMG');
    expect(icon.getAttribute('src')).toBe('images/svg/cards/dolar.svg');
  });

  it('should render value', () => {
    setDefaultInputs({ value: '$45,231.89' });

    const value = fixture.nativeElement.querySelector('.statistic-card__value');
    expect(value.textContent).toBe('$45,231.89');
  });

  it('should render change text', () => {
    setDefaultInputs({ change: '+20.1% from last month' });

    const change = fixture.nativeElement.querySelector(
      '.statistic-card__change',
    );
    expect(change.textContent.trim()).toBe('+20.1% from last month');
  });

  it('should apply positive data-type attribute', () => {
    setDefaultInputs({ changeType: 'positive' });

    const change = fixture.nativeElement.querySelector(
      '.statistic-card__change',
    );
    expect(change.getAttribute('data-type')).toBe('positive');
  });

  it('should apply negative data-type attribute', () => {
    setDefaultInputs({ changeType: 'negative', change: '-4%' });

    const change = fixture.nativeElement.querySelector(
      '.statistic-card__change',
    );
    expect(change.getAttribute('data-type')).toBe('negative');
  });
});
