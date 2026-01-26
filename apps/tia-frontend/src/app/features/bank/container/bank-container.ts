import { Component } from '@angular/core';
import { Sidebar } from "../shared/ui/sidebar/sidebar";
import { RouterModule } from "@angular/router";
import { BankHeaderContainer } from "../shared/ui/bank-header/container/bank-header-container";

@Component({
  selector: 'app-bank-container',
  imports: [Sidebar, RouterModule, BankHeaderContainer],
  templateUrl: './bank-container.html',
  styleUrl: './bank-container.scss',
})
export class BankContainer {}
