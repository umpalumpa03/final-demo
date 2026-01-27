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

  protected isVertical = computed<boolean>(
    () => this.orientation() === 'vertical',
  );

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

    const rect = container.getBoundingClientRect();
    const containerDimension = this.isVertical() ? rect.height : rect.width;

    const size = this.panelSize();
    const customSizes = this.initialSizes();

    const totalResizerSize = (size - 1) * this.resizerSize();
    const availableDimension = containerDimension - totalResizerSize;

    const defaultPanelSize = 300;
    const equalPanelSize =
      availableDimension > 0
        ? Math.floor(availableDimension / size)
        : defaultPanelSize;

    if (customSizes && customSizes.length > 0) {
      if (size === 2) {
        this.panelSizes.set([customSizes[0]]);
      } else {
        const panel1 = customSizes[0] || equalPanelSize;
        const panel2 = customSizes[1] || equalPanelSize;
        const panel3 =
          availableDimension > 0
            ? availableDimension - panel1 - panel2
            : defaultPanelSize;
        this.panelSizes.set([panel1, panel2, Math.max(this.minSize(), panel3)]);
      }
      return;
    }

    if (size === 2) {
      this.panelSizes.set([equalPanelSize]);
    } else {
      this.panelSizes.set([equalPanelSize, equalPanelSize, equalPanelSize]);
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

    if (size === 2 && index === size - 1) {
      return 'auto';
    }

    return `${sizes[index] || 300}px`;
  }

  protected isLastPanel(index: number): boolean {
    return this.panelSize() === 2 && index === this.panelSize() - 1;
  }

  protected isLastPanelInThreeMode(index: number): boolean {
    return this.panelSize() === 3 && index === 2;
  }

  protected showResizerAfter(index: number): boolean {
    return index < this.panelSize() - 1;
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
    const minSize = this.minSize();
    const size = this.panelSize();

    if (size === 2) {
      const newSize = this.startSizes[activeIndex] + delta;
      const dynamicMax = this.calculateMaxSize(activeIndex, newSizes);
      newSizes[activeIndex] = Math.max(minSize, Math.min(dynamicMax, newSize));
    } else {
      const leftPanelIndex = activeIndex;
      const rightPanelIndex = activeIndex + 1;

      const leftStart = this.startSizes[leftPanelIndex];
      const rightStart = this.startSizes[rightPanelIndex];

      let newLeftSize = leftStart + delta;
      let newRightSize = rightStart - delta;

      if (newLeftSize < minSize) {
        newLeftSize = minSize;
        newRightSize = leftStart + rightStart - minSize;
      }
      if (newRightSize < minSize) {
        newRightSize = minSize;
        newLeftSize = leftStart + rightStart - minSize;
      }

      const maxSize = this.maxSize();
      if (newLeftSize > maxSize) {
        newLeftSize = maxSize;
        newRightSize = leftStart + rightStart - maxSize;
      }
      if (newRightSize > maxSize) {
        newRightSize = maxSize;
        newLeftSize = leftStart + rightStart - maxSize;
      }

      newSizes[leftPanelIndex] = newLeftSize;
      newSizes[rightPanelIndex] = newRightSize;
    }

    this.panelSizes.set(newSizes);
  }

  private calculateMaxSize(panelIndex: number, currentSizes: number[]): number {
    const container = this.containerRef()?.nativeElement;
    if (!container) return this.maxSize();

    const containerDimension = this.isVertical()
      ? container.getBoundingClientRect().height
      : container.getBoundingClientRect().width;

    if (containerDimension <= 0) {
      return this.maxSize();
    }

    const panelCount = this.panelSize();
    const totalResizerSize = (panelCount - 1) * this.resizerSize();
    const minSize = this.minSize();

    const reservedForLastPanel = minSize;

    const availableSpace =
      containerDimension - totalResizerSize - reservedForLastPanel;

    return Math.max(minSize, Math.min(this.maxSize(), availableSpace));
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
