import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { SecurityComponent } from '../components/security.component';

@Component({
  selector: 'app-security-container',
  imports: [SecurityComponent],
  templateUrl: './security-container.html',
  styleUrl: './security-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityContainer {
}
