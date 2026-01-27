import { Component, inject } from '@angular/core';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { ButtonComponent } from '../../../../shared/lib/primitives/button/button';
import { FINANCES_FILTER_OPTIONS, summaryCards } from '../constants/filter-options.config';
import { FilterType, FinancesParams } from '../models/filter.model';
import { Store } from '@ngrx/store';
import { TextInput } from '../../../../shared/lib/forms/input-field/text-input';
import { StatisticCard } from '../../../../shared/lib/cards/statistic-card/statistic-card';

@Component({
  selector: 'app-finances-container',
  imports: [LibraryTitle, ButtonComponent, TextInput, StatisticCard],
  templateUrl: './finances-container.html',
  styleUrl: './finances-container.scss',
})
export class FinancesContainer {
  public readonly financeTitle:string = "My Finances";
  public readonly financeSubTitle:string = "Track your income, expenses, and savings";

  readonly filterOptions = FINANCES_FILTER_OPTIONS;
  readonly summaryCardsData = summaryCards;
  activeFilter: FilterType = 'month';

  private store = inject(Store);

  currentParams: FinancesParams = {
    fromValue: new Date().toISOString().split('T')[0] 
  };

  onFilterChange(type: FilterType) {
    this.activeFilter = type;
    
    if (type === 'month') {
      this.currentParams = { 
        fromValue: new Date().toISOString().split('T')[0] 
      };
    } else {
      this.currentParams = {
        fromValue: '2026-01-01', 
        toValue: '2026-01-31'
      };
    }
    

  
  }

  

  
}
