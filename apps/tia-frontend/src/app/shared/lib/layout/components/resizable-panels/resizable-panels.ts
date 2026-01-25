import {
  Component,
  signal,
  computed,
  ElementRef,
  viewChild,
  viewChildren,
  input,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ResizableOrientation,
  DEFAULT_RESIZER_SIZE,
} from './resizable-panels.model';

@Component({
  selector: 'app-resizable-panels',
  imports: [],
  templateUrl: './resizable-panels.html',
  styleUrl: './resizable-panels.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:mousemove)': 'onMouseMove($event)',
    '(document:mouseup)': 'onMouseUp()',
  },
})
export class ResizablePanels {
  public orientation = input<ResizableOrientation>('horizontal');

  public panelSize = input<2 | 3>(2);

  protected panelIndices = computed(() =>
    Array.from({ length: this.panelSize() }, (_, i) => i),
  );

  public initialSizes = input<number[] | undefined>(undefined);

  public minSize = input<number>(100);

  public maxSize = input<number>(800);

  public resizerSize = input<number>(DEFAULT_RESIZER_SIZE);

  protected isVertical = computed(() => this.orientation() === 'vertical');

  protected containerRef = viewChild<ElementRef<HTMLElement>>('container');
  protected contentRef = viewChild<ElementRef<HTMLElement>>('contentWrapper');
  protected panelsContainerRef =
    viewChild<ElementRef<HTMLElement>>('panelsContainer');
  protected panelRefs = viewChildren<ElementRef<HTMLElement>>('panel');

  protected panelSizes = signal<number[]>([300]);

  protected activeResizer = signal<number | null>(null);

  private startPosition = 0;
  private startSizes: number[] = [];

  constructor() {
    afterNextRender(() => {
      this.distributeContent();
      this.initializePanelSizes();
    });
  }

  private initializePanelSizes(): void {
    const container = this.containerRef()?.nativeElement;
    if (!container) return;

    const isVertical = this.isVertical();
    const containerDimension = isVertical
      ? container.offsetHeight
      : container.offsetWidth;
    const size = this.panelSize();
    const customSizes = this.initialSizes();

    if (customSizes && customSizes.length > 0) {
      if (size === 2) {
        this.panelSizes.set([customSizes[0]]);
      } else {
        this.panelSizes.set([customSizes[0], customSizes[1] || customSizes[0]]);
      }
      return;
    }

    const totalResizerSize = (size - 1) * this.resizerSize();
    const availableDimension = containerDimension - totalResizerSize;
    const panelSize = Math.floor(availableDimension / size);

    if (size === 2) {
      this.panelSizes.set([panelSize]);
    } else {
      this.panelSizes.set([panelSize, panelSize]);
    }
  }

  private distributeContent(): void {
    const contentWrapper = this.contentRef()?.nativeElement;
    const panels = this.panelRefs();

    if (!contentWrapper || panels.length === 0) return;

    const children = Array.from(contentWrapper.children) as HTMLElement[];

    for (let i = 0; i < panels.length; i++) {
      if (panels[i] && children[i]) {
        panels[i].nativeElement.appendChild(children[i]);
      }
    }
  }

  protected getPanelSize(index: number): string {
    const sizes = this.panelSizes();
    const size = this.panelSize();

    if (index === size - 1) {
      return 'auto';
    }

    return `${sizes[index] || 300}px`;
  }

  protected isLastPanel(index: number): boolean {
    return index === this.panelSize() - 1;
  }

  protected onMouseDown(event: MouseEvent, resizerIndex: number): void {
    event.preventDefault();
    this.activeResizer.set(resizerIndex);
    this.startPosition = this.isVertical() ? event.clientY : event.clientX;
    this.startSizes = [...this.panelSizes()];
  }

  protected onMouseMove(event: MouseEvent): void {
    const activeIndex = this.activeResizer();
    if (activeIndex === null) return;

    const currentPosition = this.isVertical() ? event.clientY : event.clientX;
    const delta = currentPosition - this.startPosition;
    const newSizes = [...this.startSizes];

    const newSize = this.startSizes[activeIndex] + delta;

    const clampedSize = Math.max(
      this.minSize(),
      Math.min(this.maxSize(), newSize),
    );

    newSizes[activeIndex] = clampedSize;
    this.panelSizes.set(newSizes);
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
