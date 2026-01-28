import { Component, input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { IFeaturePanel } from '../../../models/config.models';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [],
  templateUrl: './side-panel.html',
  styleUrls: ['./side-panel.scss'],
})
export class SidePanel {
  public title = input<string>();
  public description = input<string>();
  public features = input<IFeaturePanel[] | undefined>();

  public getIconUrl(icon: string | undefined): string {
    return icon ? `url(${icon})` : 'none';
  }
}
