import { Component } from '@angular/core';
import { Sidebar } from "../shared/ui/sidebar/sidebar";
import { RouterModule } from "@angular/router";
import { BankHeader } from "../shared/ui/bank-header/bank-header";

@Component({
  selector: 'app-bank-container',
  imports: [Sidebar, RouterModule, BankHeader],
  templateUrl: './bank-container.html',
  styleUrl: './bank-container.scss',
})
export class BankContainer {}
