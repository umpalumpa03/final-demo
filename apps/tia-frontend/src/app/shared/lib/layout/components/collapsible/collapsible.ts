import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CollapsibleConfig } from './models/collapsible.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-collapsible',
  imports: [TranslatePipe],
  templateUrl: './collapsible.html',
  styleUrl: './collapsible.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collapsible implements OnInit {
  public readonly config = input.required<CollapsibleConfig>();

  public isOpen = signal<boolean>(false);

  public ngOnInit(): void {
    if (this.config().isOpenDefault) {
      this.isOpen.set(true);
    }
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
