import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IFeaturePanel } from '../../models/auth.models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-panel',
  imports: [TranslatePipe],
  templateUrl: './side-panel.html',
  styleUrls: ['./side-panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidePanel {
  public title = input<string>();
  public description = input<string>();
  public features = input<IFeaturePanel[] | undefined>();

  public getIconUrl(icon: string | undefined): string {
    return icon ? `url(${icon})` : 'none';
  }
}
