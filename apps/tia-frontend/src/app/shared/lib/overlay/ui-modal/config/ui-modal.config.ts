export function calculateModalPositions(target: HTMLElement, padding: number, gap: number) {
  const rect = target.getBoundingClientRect();

  return {
    spotlightStyle: {
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      borderRadius: '8px',
    },
    cardStyle: {
      position: 'fixed',
      top: `${rect.bottom + gap}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translateX(-50%)',
      margin: '0',
    }
  };
}

export function toggleBodyScroll(lock: boolean): void {
  document.body.style.overflow = lock ? 'hidden' : ''; //
}