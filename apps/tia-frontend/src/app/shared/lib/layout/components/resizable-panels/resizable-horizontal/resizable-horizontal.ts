import {
  Component,
  signal,
  ElementRef,
  viewChild,
  input,
  effect,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-resizable-horizontal',
  imports: [],
  templateUrl: './resizable-horizontal.html',
  styleUrl: './resizable-horizontal.scss',
  changeDetection:  ChangeDetectionStrategy.OnPush,
  host: {
    '(document:mousemove)': 'onMouseMove($event)',
    '(document:mouseup)': 'onMouseUp()',
  },
})
export class ResizableHorizontal {
  public panelSize = input<2 | 3>(2);

  public initialWidths = input<number[]>([300]);

  public minWidth = input<number>(100);

  public maxWidth = input<number>(800);

  protected containerRef = viewChild<ElementRef<HTMLElement>>('container');
  protected contentRef = viewChild<ElementRef<HTMLElement>>('contentWrapper');
  protected panelsContainerRef =
    viewChild<ElementRef<HTMLElement>>('panelsContainer');

  protected panelWidths = signal<number[]>([300]);

  protected activeResizer = signal<number | null>(null);

  private startX = 0;
  private startWidths: number[] = [];

  constructor() {
    effect(() => {
      const widths = this.initialWidths();
      const size = this.panelSize();

      if (size === 2) {
        this.panelWidths.set([widths[0] || 300]);
      } else {
        this.panelWidths.set([widths[0] || 300, widths[1] || 300]);
      }
    });

    afterNextRender(() => {
      this.distributeContent();
    });
  }

  private distributeContent(): void {
    const contentWrapper = this.contentRef()?.nativeElement;
    const panelsContainer = this.panelsContainerRef()?.nativeElement;

    if (!contentWrapper || !panelsContainer) return;

    const children = Array.from(contentWrapper.children) as HTMLElement[];
    const expectedPanels = this.panelSize();

    const panels = panelsContainer.querySelectorAll('.panel');
    for (let i = 0; i < expectedPanels; i++) {
      if (panels[i] && children[i]) {
        panels[i].appendChild(children[i]);
      }
    }
  }

  protected getPanelWidth(index: number): string {
    const widths = this.panelWidths();
    const size = this.panelSize();

    if (index === size - 1) {
      return 'auto';
    }

    return `${widths[index] || 300}px`;
  }

  protected isLastPanel(index: number): boolean {
    return index === this.panelSize() - 1;
  }

  protected onMouseDown(event: MouseEvent, resizerIndex: number): void {
    event.preventDefault();
    this.activeResizer.set(resizerIndex);
    this.startX = event.clientX;
    this.startWidths = [...this.panelWidths()];
  }

  protected onMouseMove(event: MouseEvent): void {
    const activeIndex = this.activeResizer();
    if (activeIndex === null) return;

    const deltaX = event.clientX - this.startX;
    const newWidths = [...this.startWidths];

    const newWidth = this.startWidths[activeIndex] + deltaX;

    const clampedWidth = Math.max(
      this.minWidth(),
      Math.min(this.maxWidth(), newWidth),
    );

    newWidths[activeIndex] = clampedWidth;
    this.panelWidths.set(newWidths);
  }

  protected onMouseUp(): void {
    this.activeResizer.set(null);
  }

  protected isDragging(): boolean {
    return this.activeResizer() !== null;
  }

  protected isResizerDragging(index: number): boolean {
    return this.activeResizer() === index;
  }
}
