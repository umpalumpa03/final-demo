import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {DecimalPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-category-item',
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl:'./category-item.html',
  styleUrls: ['./category-item.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CategoryItem {
  public readonly label = input.required<string>();
  public readonly amount = input.required<number>();
  public readonly percentage = input.required<number>();
  public readonly color = input.required<string>();
  public readonly icon = input.required<string>();
  public readonly iconBgColor = computed(() => `${this.color()}1A`);
  public readonly isPath = computed(() => this.icon().startsWith('/'));
}