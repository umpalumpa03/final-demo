import { 
  Component, 
  inject, 
  OnInit, 
  OnDestroy,
  output, 
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors'; 
import { ButtonComponent } from '../../../shared/lib/primitives/button/button';
import { BIRTHDAY_EMOJIS } from '../configs/birthday-config';
import { BirthdayLogicService } from '../services/birthday-logic.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-birthday-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './birthday-modal.html',
  styleUrl: './birthday-modal.scss',
})
export class BirthdayModalComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly birthdayLogic = inject(BirthdayLogicService);
  
  public readonly dismiss = output<void>();
  public readonly userInfo = this.store.selectSignal(selectUserInfo);
  public readonly userName = () => this.userInfo()?.fullName;

  public readonly buttonIcon = BIRTHDAY_EMOJIS.find(e => e.name === 'buttonHearth')?.svgPath;
  public readonly middleEmojis = BIRTHDAY_EMOJIS.filter(e => e.name !== 'header' && e.name !== 'buttonHearth');
  public readonly headerIcon = BIRTHDAY_EMOJIS.find(e => e.name === 'header')?.svgPath;

  private animationFrameId?: number;

  ngOnInit(): void {
    if (this.birthdayLogic.shouldLaunchConfetti()) {
      this.launchConfetti();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    confetti.reset(); 
  }

  public onDismiss(): void {
    this.dismiss.emit();
    this.cdr.markForCheck(); 
  }

  private launchConfetti(): void {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#3b82f6', '#f472b6']
      });

      if (Date.now() < end) {
        this.animationFrameId = requestAnimationFrame(frame);
      }
    };
    frame();
  }
}