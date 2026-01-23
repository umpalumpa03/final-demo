import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {ButtonComponent} from "../../../../../../shared/lib/primitives/button/button"
import { ButtonGroupComponent } from '../../../../../../shared/lib/primitives/button-group/button-group.component';
import { TitleCasePipe } from '@angular/common';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from "../../shared/showcase-card/showcase-card";
import * as CONFIG from './button-config/button-library.config'

@Component({
  selector: 'app-button-library',
  imports: [ButtonComponent, ButtonGroupComponent, TitleCasePipe, LibraryTitle, ShowcaseCard],
  templateUrl: './button-library.html',
  styleUrl: './button-library.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLibraryComponent {
  protected readonly isInteractiveLoading = signal(false);
  
  protected readonly variants = signal(CONFIG.BUTTON_VARIANTS);
  protected readonly sizes = signal(CONFIG.BUTTON_SIZES);
  protected readonly stateExamples = signal(CONFIG.STATE_EXAMPLES); 
  protected readonly iconButtons = signal(CONFIG.ICON_BUTTONS);
  protected readonly iconOnlyButtons = signal(CONFIG.ICON_ONLY_BUTTONS);
  protected readonly interactiveItems = signal(CONFIG.INTERACTIVE_EXAMPLES);
  public readonly groupLabels = signal<string[]>(['Left', 'Middle', 'Right']);
  

  public readonly title:string = "Buttons";
  public readonly subtitle:string = "A comprehensive showcase of all components with their various states"


  protected toggleLoading(): void {
    this.isInteractiveLoading.set(true);
    setTimeout(() => this.isInteractiveLoading.set(false), 2000);
  }
}