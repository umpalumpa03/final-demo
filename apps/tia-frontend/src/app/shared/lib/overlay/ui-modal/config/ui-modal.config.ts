import { ModalCardConfig, ModalOffset } from '../models/modal-positions.model';

export type ModalPlacement = 'top' | 'bottom' | 'left' | 'right';

const MOBILE_BREAKPOINT = 768;

export function calculateModalPositions(
  target: HTMLElement | null,
  padding: number,
  gap: number,
  placement: ModalPlacement = 'bottom',
  offset: ModalOffset = {},
) {
  if (
    !target ||
    target.offsetParent === null ||
    !document.body.contains(target)
  ) {
    return { spotlightStyle: null, cardStyle: null, isFallback: true };
  }

  const rect = target.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return { spotlightStyle: null, cardStyle: null, isFallback: true };
  }

  const spotlightStyle = {
    top: `${rect.top - padding}px`,
    left: `${rect.left - padding}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
    borderRadius: '0.8rem',
  };

  const cardStyle: ModalCardConfig = {
    position: 'fixed',
    zIndex: '20',
  };

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  switch (placement) {
    case 'top':
      cardStyle['bottom'] =
        `${window.innerHeight - rect.top + gap + (offset.bottom ?? 0)}px`;
      cardStyle['left'] = isMobile
        ? '50%'
        : `calc(${rect.left + rect.width / 2}px + ${offset.left ?? 0}px)`;
      cardStyle['transform'] = 'translateX(-50%)';
      break;
    case 'left':
      cardStyle['top'] =
        `calc(${rect.top + rect.height / 2}px + ${offset.top ?? 0}px)`;
      cardStyle['right'] =
        `${window.innerWidth - rect.left + gap + (offset.right ?? 0)}px`;
      cardStyle['transform'] = 'translateY(-50%)';
      break;
    case 'right':
      cardStyle['top'] =
        `calc(${rect.top + rect.height / 2}px + ${offset.top ?? 0}px)`;
      cardStyle['left'] = `${rect.right + gap + (offset.left ?? 0)}px`;
      cardStyle['transform'] = 'translateY(-50%)';
      break;
    default:
      cardStyle['top'] = `${rect.bottom + gap + (offset.top ?? 0)}px`;
      cardStyle['left'] = isMobile
        ? '50%'
        : `calc(${rect.left + rect.width / 2}px + ${offset.left ?? 0}px)`;
      cardStyle['transform'] = 'translateX(-50%)';
  }

  return { spotlightStyle, cardStyle, isFallback: false };
}

export function toggleBodyScroll(lock: boolean): void {
  document.body.style.overflow = lock ? 'hidden' : '';
}
