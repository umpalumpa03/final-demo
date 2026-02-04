import { Component } from '@angular/core';
import { BasicCard } from "@tia/shared/lib/cards/basic-card/basic-card";
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";
import { Badges } from "@tia/shared/lib/primitives/badges/badges";

@Component({
  selector: 'app-account-card',
  imports: [BasicCard, ButtonComponent, Badges],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
})
export class AccountCard {}
