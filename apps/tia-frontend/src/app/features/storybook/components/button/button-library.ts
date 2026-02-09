import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ButtonComponent } from "../../../../shared/lib/primitives/button/button";
import { ButtonGroupComponent } from '../../../../shared/lib/primitives/button-group/button-group.component';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from "../../shared/showcase-card/showcase-card";
import { ButtonDemoState } from './state/button-demos.state';

@Component({
  selector: 'app-button-library',
  imports: [
    ButtonComponent, 
    ButtonGroupComponent, 
    LibraryTitle, 
    ShowcaseCard
  ],
  templateUrl: './button-library.html',
  styleUrl: './button-library.scss',
  providers: [ButtonDemoState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLibraryComponent {
  private readonly state = inject(ButtonDemoState);
  protected readonly isInteractiveLoading = signal(false);

  protected readonly pageInfo = this.state.pageInfo;
  protected readonly sectionTitles = this.state.titles;
  protected readonly variants = this.state.variants;
  protected readonly sizes = this.state.sizes;
  protected readonly stateExamples = this.state.stateExamples;
  protected readonly iconButtons = this.state.iconButtons;
  protected readonly interactiveItems = this.state.interactiveItems; 
  protected readonly buttonGroups = this.state.buttonGroups;
  protected readonly labels = this.state.labels;

  protected toggleLoading(): void {
    this.isInteractiveLoading.set(true);
    setTimeout(() => this.isInteractiveLoading.set(false), 2000);
  }
}