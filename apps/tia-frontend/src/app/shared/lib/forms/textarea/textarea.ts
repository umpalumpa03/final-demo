import {
  Component,
  computed,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
  Renderer2,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInput } from '../base/base-input';
import { TEXTAREA_DEFAULTS } from '../config/textarea.config';
import { TextareaConfig } from '../models/textarea.model';

@Component({
  selector: 'lib-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.html',
  styleUrls: ['./textarea.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textarea extends BaseInput implements AfterViewInit {
  override readonly config = input<TextareaConfig>({});

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  private renderer = inject(Renderer2);

  protected mergedConfig = computed<TextareaConfig>(() => ({
    ...TEXTAREA_DEFAULTS,
    ...this.config(),
  }));

  protected currentLength = computed<number>(() => {
    const val = this.value();
    return val ? String(val).length : 0;
  });

  protected counterText = computed<string>(() => {
    const current = this.currentLength();
    const max = this.maxCharacters();
    return max > 0 ? `${current} / ${max} characters` : `${current} characters`;
  });

  ngAfterViewInit() {
    this.adjustHeight();
  }

  protected override handleInput(event: Event): void {
    super.handleInput(event);
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const el = this.textareaRef?.nativeElement;
    if (!el) return;

    this.renderer.setStyle(el, 'height', 'auto');
    this.renderer.setStyle(el, 'height', el.scrollHeight + 'px');
  }
}
