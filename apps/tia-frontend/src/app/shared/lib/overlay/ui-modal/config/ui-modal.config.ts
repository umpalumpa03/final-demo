export type ModalPlacement = 'top' | 'bottom' | 'left' | 'right';

export function calculateModalPositions(
  target: HTMLElement,
  padding: number,
  gap: number,
  placement: ModalPlacement = 'bottom',
) {
  const rect = target.getBoundingClientRect();
  const spotlightStyle: Record<string, string> = {
    top: `${rect.top - padding}px`,
    left: `${rect.left - padding}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
    borderRadius: '8px',
  };

  const cardStyle: Record<string, string> = {
    position: 'fixed',
    margin: '0',
    zIndex: '20',
  };

  switch (placement) {
    case 'top':
      cardStyle['bottom'] = `${window.innerHeight - rect.top + gap}px`;
      cardStyle['left'] = `${rect.left + rect.width / 2}px`;
      cardStyle['transform'] = 'translateX(-50%)';
      break;
    case 'left':
      cardStyle['top'] = `${rect.top + rect.height / 2}px`;
      cardStyle['right'] = `${window.innerWidth - rect.left + gap}px`;
      cardStyle['transform'] = 'translateY(-50%)';
      break;
    case 'right':
      cardStyle['top'] = `${rect.top + rect.height / 2}px`;
      cardStyle['left'] = `${rect.right + gap}px`;
      cardStyle['transform'] = 'translateY(-50%)';
      break;
    case 'bottom':
    default:
      cardStyle['top'] = `${rect.bottom + gap}px`;
      cardStyle['left'] = `${rect.left + rect.width / 2}px`;
      cardStyle['transform'] = 'translateX(-50%)';
      break;
  }

  return { spotlightStyle, cardStyle };
}

export function toggleBodyScroll(lock: boolean): void {
  document.body.style.overflow = lock ? 'hidden' : '';
}
