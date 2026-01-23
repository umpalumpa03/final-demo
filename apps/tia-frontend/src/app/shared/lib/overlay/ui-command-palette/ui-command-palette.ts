import {
  Component,
  computed,
  HostListener,
  input,
  output,
  signal,
  ViewChild,
  ElementRef,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  CommandAction,
  CommandPaletteConfig,
  ProcessedCommandAction,
} from './models/palette.model';
import { getPaletteIconPath } from './utils/ui-command-palette.config';

@Component({
  selector: 'app-ui-command-palette',
  templateUrl: './ui-command-palette.html',
  styleUrl: './ui-command-palette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCommandPalette {
  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

  public readonly actions = input.required<CommandAction[]>();
  public readonly config = input<CommandPaletteConfig>({
    placeholder: 'Type a command or search...',
  });

  public readonly actionSelected = output<CommandAction>();
  public readonly menuClose = output<void>();

  public searchQuery = signal<string>('');
  public activeIndex = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      this.searchInput.nativeElement.focus();
    });
  }

  private readonly filteredActions = computed<ProcessedCommandAction[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.actions();

    const filtered = query
      ? list.filter((a) => a.label.toLowerCase().includes(query))
      : list;

    return filtered.map((item) => ({
      ...item,
      fullIconPath: getPaletteIconPath(item.icon),
    }));
  });

  public readonly suggestions = computed(() =>
    this.filteredActions().filter((a) => a.isSuggestion),
  );

  public readonly otherActions = computed(() =>
    this.filteredActions().filter((a) => !a.isSuggestion),
  );

  public readonly totalCount = computed(() => this.filteredActions().length);

  @HostListener('window:keydown.escape')
  public onEscape(): void {
    this.menuClose.emit();
  }

  @HostListener('keydown', ['$event'])
  public handleKeyboard(event: KeyboardEvent): void {
    const count = this.totalCount();
    const selected = this.filteredActions()[this.activeIndex()];
    if (count === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => (i - 1 + count) % count);
        break;
      case 'Enter':
        if (selected) {
          this.onSelect(selected);
        }
        break;
    }
  }

  public handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.activeIndex.set(0);
  }

  public onSelect(action: CommandAction): void {
    this.actionSelected.emit(action);
    this.menuClose.emit();
  }
}
