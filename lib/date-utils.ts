/**
 * Utilitários para formatação e manipulação de data e horário (Blog & Imprensa)
 */

const MONTH_NAMES_PT: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  março: 2,
  marco: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

/**
 * Converte qualquer formato de data do sistema para um objeto Date válido.
 */
export function parseAnyDate(dateInput: string | Date | undefined | null): Date {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? new Date() : dateInput;

  const trimmed = dateInput.trim();

  // 1. Tenta parse padrão ISO ou timestamp
  const directDate = new Date(trimmed);
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  // 2. Formato brasileiro com hora: "21/09/2026 às 16:13" ou "21/09/2026 16:13"
  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(?:às\s+)?(\d{1,2}):(\d{1,2}))?/i);
  if (brMatch) {
    const day = parseInt(brMatch[1], 10);
    const month = parseInt(brMatch[2], 10) - 1;
    const year = parseInt(brMatch[3], 10);
    const hour = brMatch[4] ? parseInt(brMatch[4], 10) : 12;
    const min = brMatch[5] ? parseInt(brMatch[5], 10) : 0;
    return new Date(year, month, day, hour, min);
  }

  // 3. Formato textual em português: "10 de março de 2024" ou "outubro 10, 2023"
  const ptMatch = trimmed.match(/(\d{1,2})?\s*de?\s*([a-záéíóúç]+)[,\s]+de?\s*(\d{4})/i);
  if (ptMatch) {
    const day = ptMatch[1] ? parseInt(ptMatch[1], 10) : 1;
    const monthName = ptMatch[2].toLowerCase();
    const month = MONTH_NAMES_PT[monthName] ?? 0;
    const year = parseInt(ptMatch[3], 10);
    return new Date(year, month, day, 12, 0);
  }

  const enStylePt = trimmed.match(/([a-záéíóúç]+)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (enStylePt) {
    const monthName = enStylePt[1].toLowerCase();
    const month = MONTH_NAMES_PT[monthName] ?? 0;
    const day = parseInt(enStylePt[2], 10);
    const year = parseInt(enStylePt[3], 10);
    return new Date(year, month, day, 12, 0);
  }

  return new Date();
}

/**
 * Retorna o timestamp numérico para ordenação e filtros.
 */
export function getTimestamp(dateInput: string | Date | undefined | null): number {
  return parseAnyDate(dateInput).getTime();
}

/**
 * Formato conciso ideal para Cards: "21/09/2026 às 16:13"
 */
export function formatCardDate(dateInput: string | Date | undefined | null): string {
  const d = parseAnyDate(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} às ${hours}:${mins}`;
}

/**
 * Formato completo e elegante para páginas internas: "21 de setembro de 2026 às 16:13"
 */
export function formatFullDateWithTime(dateInput: string | Date | undefined | null): string {
  const d = parseAnyDate(dateInput);
  const formattedDate = d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');

  return `${formattedDate} às ${hours}:${mins}`;
}

/**
 * Formato para inputs datetime-local (YYYY-MM-DDTHH:mm)
 */
export function formatForDateTimeInput(dateInput: string | Date | undefined | null): string {
  const d = parseAnyDate(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${mins}`;
}
