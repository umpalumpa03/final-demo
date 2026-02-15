export function maskDateInput(
  originalValue: string,
  cursorPosition: number = 0,
): { value: string; cursor: number } {
  let cleaned = originalValue.replace(/[^0-9/]/g, '');
  let formattedDate = '';

  const hasSlashes = cleaned.includes('/');

  if (hasSlashes) {
    const parts = cleaned.split('/');
    let day = parts[0]?.substring(0, 2) || '';
    if (day.length === 2 && Number(day) > 31) day = '31';

    let month = parts[1]?.substring(0, 2) || '';
    if (month.length === 2 && Number(month) > 12) month = '12';

    const year = parts[2]?.substring(0, 4) || '';

    formattedDate = day;
    if (parts.length > 1 || day.length === 2) formattedDate += '/' + month;
    if (parts.length > 2 || month.length === 2) formattedDate += '/' + year;
  } else {
    const digits = cleaned.replace(/\D/g, '');
    let d = digits.slice(0, 2);
    let m = '';
    let y = '';

    if (d.length === 2 && Number(d) > 31) d = '31';
    if (digits.length > 2) {
      m = digits.slice(2, 4);
      if (m.length === 2 && Number(m) > 12) m = '12';
    }
    if (digits.length > 4) {
      y = digits.slice(4, 8);
    }

    formattedDate = d;
    if (digits.length > 2) formattedDate += '/' + m;
    if (digits.length > 4) formattedDate += '/' + y;
  }

  if (
    originalValue.length < formattedDate.length &&
    cursorPosition === originalValue.length
  ) {
    cursorPosition = formattedDate.length;
  }

  return { value: formattedDate, cursor: cursorPosition };
}

export function parseDateToIso(formattedStr: string): string | null {
  if (formattedStr.length !== 10) return null;

  const [day, month, year] = formattedStr.split('/');
  if (day.length === 2 && month.length === 2 && year.length === 4) {
    const isoDate = `${year}-${month}-${day}`;
    const d = new Date(isoDate);
    if (!isNaN(d.getTime())) {
      return isoDate;
    }
  }
  return null;
}

export function formatDateDisplay(isoValue: string | number | null): string {
  if (typeof isoValue === 'string' && isoValue) {
    const parts = isoValue.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return isoValue ? String(isoValue) : '';
}
