import { 
  Component, 
  inject, 
  OnInit, 
  OnDestroy,
  output, 
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors'; 
import { ButtonComponent } from '../../../shared/lib/primitives/button/button';
import { BIRTHDAY_EMOJIS } from '../config/birthday.config';
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
  
  public readonly dismiss = output<void>();
  public readonly userInfo = this.store.selectSignal(selectUserInfo);
  public readonly userName = () => this.userInfo()?.fullName;

  public readonly buttonIcon = BIRTHDAY_EMOJIS.find(e => e.name === 'buttonHearth')?.svgPath;
  public readonly middleEmojis = BIRTHDAY_EMOJIS.filter(e => e.name !== 'header' && e.name !== 'buttonHearth');
  public readonly headerIcon = BIRTHDAY_EMOJIS.find(e => e.name === 'header')?.svgPath;

  ngOnInit(): void {
    this.launchConfetti();
  }

  private launchConfetti(): void {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  public onDismiss(): void {
    confetti.reset();
    this.dismiss.emit();
  }

  ngOnDestroy(): void {
    confetti.reset(); 
  }
}