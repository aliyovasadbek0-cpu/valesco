import { plainToInstance } from 'class-transformer';
import { PackingDto } from '../../products/dto/create-products.dto';

export function toStringArray(value: any): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(String).filter((s) => s.trim() !== '');
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map(String).filter((s) => s.trim() !== '') : [];
      } catch {
        return [];
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter((s) => s !== '');
  }

  return [];
}

export function toPackingArray(value: any): PackingDto[] {
  if (!value) return [];

  let parsed: any[] = [];

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  } else if (Array.isArray(value)) {
    parsed = value;
  } else {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return plainToInstance(PackingDto, parsed.filter((item) => item.volume && item.article));
}