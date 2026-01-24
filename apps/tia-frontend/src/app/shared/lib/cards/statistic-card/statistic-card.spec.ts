import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticCard } from './statistic-card';

describe('StatisticCard', () => {
  let component: StatisticCard;
  let fixture: ComponentFixture<StatisticCard>;

  const setInputs = (overrides?: {
    label?: string;
    value?: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon?: string;
  }) => {
    fixture.componentRef.setInput('label', overrides?.label ?? 'Test Label');
    fixture.componentRef.setInput('value', overrides?.value ?? '100');
    fixture.componentRef.setInput('change', overrides?.change ?? '+10%');
    fixture.componentRef.setInput('changeType', overrides?.changeType ?? 'positive');
    fixture.componentRef.setInput('icon', overrides?.icon ?? 'images/svg/cards/dolar.svg');
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticCard);
    component = fixture.componentInstance;
  });

  it('should render all card elements correctly', () => {
    setInputs({
      label: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: 'images/svg/cards/dolar.svg',
    });

    const label = fixture.nativeElement.querySelector('.statistic-card__label');
    const value = fixture.nativeElement.querySelector('.statistic-card__value');
    const change = fixture.nativeElement.querySelector('.statistic-card__change');
    const icon = fixture.nativeElement.querySelector('.statistic-card__icon');

    expect(label.textContent).toBe('Total Revenue');
    expect(value.textContent).toBe('$45,231.89');
    expect(change.textContent.trim()).toBe('+20.1% from last month');
    expect(icon.getAttribute('src')).toBe('images/svg/cards/dolar.svg');
  });

  it('should apply correct changeType attribute', () => {
    setInputs({ changeType: 'positive', change: '+20%' });
    let change = fixture.nativeElement.querySelector('.statistic-card__change');
    expect(change.getAttribute('data-type')).toBe('positive');

    setInputs({ changeType: 'negative', change: '-4%' });
    change = fixture.nativeElement.querySelector('.statistic-card__change');
    expect(change.getAttribute('data-type')).toBe('negative');
  });
});