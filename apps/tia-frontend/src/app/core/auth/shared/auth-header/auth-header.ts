import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-header',
  imports: [TranslatePipe],
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHeader {
  public title = input.required<string>()
  public subTitle = input.required<string>()
}
