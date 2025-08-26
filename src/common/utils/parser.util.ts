import { plainToInstance } from 'class-transformer';
import { PackingDto } from '../../products/dto/create-products.dto';

export function toStringArray(value: any): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        return [];
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
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
  }

  if (!Array.isArray(parsed)) return [];

  return plainToInstance(PackingDto, parsed);
}