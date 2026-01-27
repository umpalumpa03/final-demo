import { Component, input, output } from '@angular/core';
import { PaybillProvider } from '../../../../models/paybill.model';
import { BasicCard } from "@tia/shared/lib/cards/basic-card/basic-card";
import { ScrollArea } from "@tia/shared/lib/layout/components/scroll-area/container/scroll-area";

@Component({
  selector: 'app-provider-list',
  imports: [BasicCard, ScrollArea],
  templateUrl: './provider-list.html',
  styleUrl: './provider-list.scss',
})
export class ProviderList {
  public readonly categoryName = input.required<string>();
  public readonly providers = input.required<PaybillProvider[]>();
  public readonly iconBgColor = input<string>();
  public readonly iconBgPath = input<string>();
  public readonly subtitle = input<string>();
  public readonly selected = output<string>();
}
