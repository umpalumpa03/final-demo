import { 
  Component, 
  inject, 
  OnInit, 
  output, 
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors'; 
import { ButtonComponent } from '../../../shared/lib/primitives/button/button';
import { BIRTHDAY_EMOJIS } from '../config/birthday.config';
import { BirthdayLogicService } from '../services/birthday-logic.service';

@Component({
  selector: 'app-birthday-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './birthday-modal.html',
  styleUrl: './birthday-modal.scss',
})
export class BirthdayModalComponent {
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly birthdayLogic = inject(BirthdayLogicService);
  
  public readonly dismiss = output<void>();
  public readonly userInfo = this.store.selectSignal(selectUserInfo);
  public readonly userName = () => this.userInfo()?.fullName;

  public readonly buttonIcon = BIRTHDAY_EMOJIS.find(e => e.name === 'buttonHearth')?.svgPath;
  public readonly middleEmojis = BIRTHDAY_EMOJIS.filter(e => e.name !== 'header' && e.name !== 'buttonHearth');
  public readonly headerIcon = BIRTHDAY_EMOJIS.find(e => e.name === 'header')?.svgPath;

  public onDismiss(): void {
    this.dismiss.emit();
    this.cdr.markForCheck(); 
  }
}