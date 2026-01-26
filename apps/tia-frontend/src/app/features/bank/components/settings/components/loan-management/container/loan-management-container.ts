import { Component } from '@angular/core';
import { LoanManagementComponent } from '../components/loan-management.component';

@Component({
  selector: 'app-loan-management-container',
  imports: [LoanManagementComponent],
  templateUrl: './loan-management-container.html',
  styleUrl: './loan-management-container.scss',
})
export class LoanManagementContainer {
}
