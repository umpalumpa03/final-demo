import {
  Component,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  inject,
  Renderer2,
  input,
  effect,
  viewChild,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { TEXTAREA_DEFAULTS } from '../config/textarea.config';
import { TextareaConfig } from '../models/textarea.model';

@Component({
  selector: 'lib-textarea',
  imports: [],
  templateUrl: './textarea.html',
  styleUrls: ['./textarea.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textarea extends BaseInput implements AfterViewInit {
  public override readonly config = input<TextareaConfig>({});

  private textareaRef =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaRef');

  private readonly renderer = inject(Renderer2);

  private readonly defaultId =
    this.validationService.generateUniqueId('lib-textarea');

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
    const max = this.config().validation?.maxLength || 0;
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
    const el = this.textareaRef().nativeElement;
    if (!el) return;

    const cfg = this.mergedConfig();

    if (cfg.resizable !== 'none' && cfg.resizable !== undefined) {
      return;
    }

    this.renderer.setStyle(el, 'height', 'auto');
    this.renderer.setStyle(el, 'overflow-y', 'hidden');

    const PIXELS_PER_REM = 10;

    const scrollHeightRem = el.scrollHeight / PIXELS_PER_REM;
    const maxHeightRem = cfg.maxHeight || Infinity;

    if (scrollHeightRem > maxHeightRem) {
      this.renderer.setStyle(el, 'height', `${maxHeightRem}rem`);
      this.renderer.setStyle(el, 'overflow-y', 'auto');
    } else {
      this.renderer.setStyle(el, 'height', `${scrollHeightRem}rem`);
      this.renderer.setStyle(el, 'overflow-y', 'hidden');
    }
  }
}
