import {
  Component,
  signal,
  ElementRef,
  viewChild,
  input,
  effect,
  afterNextRender,
} from '@angular/core';

@Component({
  selector: 'app-resizable-horizontal',
  imports: [],
  templateUrl: './resizable-horizontal.html',
  styleUrl: './resizable-horizontal.scss',
  host: {
    '(document:mousemove)': 'onMouseMove($event)',
    '(document:mouseup)': 'onMouseUp()',
  },
})
export class ResizableHorizontal {
  panelSize = input<2 | 3>(2);

  /** Initial widths of resizable panels in pixels [leftWidth] or [leftWidth, middleWidth] */
  initialWidths = input<number[]>([300]);

  /** Minimum width for any panel */
  minWidth = input<number>(100);

  /** Maximum width for any panel */
  maxWidth = input<number>(800);

  protected containerRef = viewChild<ElementRef<HTMLElement>>('container');
  protected contentRef = viewChild<ElementRef<HTMLElement>>('contentWrapper');
  protected panelsContainerRef =
    viewChild<ElementRef<HTMLElement>>('panelsContainer');

  protected panelWidths = signal<number[]>([300]);

  // Track which resizer is being dragged (0 = first, 1 = second)
  protected activeResizer = signal<number | null>(null);

  private startX = 0;
  private startWidths: number[] = [];

  constructor() {
    // Sync initial widths input with the signal
    effect(() => {
      const widths = this.initialWidths();
      const size = this.panelSize();

      if (size === 2) {
        this.panelWidths.set([widths[0] || 300]);
      } else {
        this.panelWidths.set([widths[0] || 300, widths[1] || 300]);
      }
    });

    // Distribute content after render
    afterNextRender(() => {
      this.distributeContent();
    });
  }

  private distributeContent(): void {
    const contentWrapper = this.contentRef()?.nativeElement;
    const panelsContainer = this.panelsContainerRef()?.nativeElement;

    if (!contentWrapper || !panelsContainer) return;

    // Get all direct element children from the content wrapper
    const children = Array.from(contentWrapper.children) as HTMLElement[];
    const expectedPanels = this.panelSize();

    if (children.length < expectedPanels) {
      throw new Error(
        `[ResizableHorizontal] Requires exactly ${expectedPanels} child elements.\n` +
          `Found: ${children.length} element(s).\n` +
          `Example:\n` +
          `<app-resizable-horizontal [panelSize]="${expectedPanels}">\n` +
          `  <div>Panel 1 content</div>\n` +
          `  <div>Panel 2 content</div>\n` +
          (expectedPanels === 3 ? `  <div>Panel 3 content</div>\n` : '') +
          `</app-resizable-horizontal>`,
      );
    }

    if (children.length > expectedPanels) {
      console.warn(
        `[ResizableHorizontal] Expected ${expectedPanels} child elements, found ${children.length}. ` +
          `Only the first ${expectedPanels} elements will be used.`,
      );
    }

    // Get panel elements and distribute content
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

    // Last panel is always flex
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

    // Calculate new width for the panel being resized
    const newWidth = this.startWidths[activeIndex] + deltaX;

    // Clamp the width between min and max
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
