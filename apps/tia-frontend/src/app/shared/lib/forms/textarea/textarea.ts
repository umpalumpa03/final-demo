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
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInput } from '../base/base-input';
import { TEXTAREA_DEFAULTS } from '../config/textarea.config';
import { TextareaConfig } from '../models/textarea.model';

// Simple unique ID generator
let uniqueIdCounter = 0;

@Component({
  selector: 'lib-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.html',
  styleUrls: ['./textarea.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textarea extends BaseInput implements AfterViewInit {
  public override readonly config = input<TextareaConfig>({});

  @ViewChild('textareaRef')
  private textareaRef!: ElementRef<HTMLTextAreaElement>;

  private readonly renderer = inject(Renderer2);

  private readonly defaultId = `lib-textarea-${uniqueIdCounter++}`;

  protected readonly mergedConfig = computed<TextareaConfig>(() => ({
    ...TEXTAREA_DEFAULTS,
    id: this.config().id || this.defaultId,
    ...this.config(),
  }));

  protected readonly currentLength = computed<number>(() => {
    const val = this.value();
    return val ? String(val).length : 0;
  });

  protected readonly counterText = computed<string>(() => {
    const current = this.currentLength();
    const max = this.maxCharacters();
    return max > 0 ? `${current} / ${max} characters` : `${current} characters`;
  });

  constructor() {
    super();
    effect(() => {
      this.value();
      setTimeout(() => this.adjustHeight(), 0);
    });
  }

  public ngAfterViewInit(): void {
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
