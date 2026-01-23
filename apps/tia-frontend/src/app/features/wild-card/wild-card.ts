import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/lib/primitives/button/button';

@Component({
  selector: 'app-wild-card',
  imports: [ButtonComponent],
  templateUrl: './wild-card.html',
  styleUrls: ['./wild-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WildCardComponent {
  private readonly router = inject(Router);

  public navigateToLibrary(): void {
    this.router.navigate(['/admin/library']); 
  }
}