import { randomUUID } from 'crypto';

export function mappingStringWithContext(str: string, context: Record<string, any>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => context[key] ?? '');
}

export function getProviderAssociate(provider: string): string {
  const map: Record<string, string> = {
    phone: 'phone',
    'facebook.com': 'facebook',
    'google.com': 'google',
    'apple.com': 'apple',
    'gc.apple.com': 'apple',
    password: 'password',
  };
  return map[provider] || 'anonymous';
}

export function objectToBase64(obj: object): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function base64ToObject<T>(base64String: string): T {
  return JSON.parse(Buffer.from(base64String, 'base64').toString('utf-8'));
}

export const booleanParam = (val?: string): boolean | undefined => {
  if (val === undefined) return undefined;
  return val === 'true' ? true : val === 'false' ? false : undefined;
};

export function firstTwoLettersOfName(name: string): string {
  if (!name) return 'XX';
  const cleaned = name.replace(/\s+/g, '');
  if (cleaned.length === 0) return 'XX';
  return cleaned.slice(0, 2).toUpperCase().padEnd(2, 'X');
}

export function generateMemorable(length = 10): string {
  if (!Number.isInteger(length) || length <= 0) throw new Error('length must be a positive integer');
  const vowels = 'aeiouAEIOU';
  const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    const pool = i % 2 === 0 ? consonants : vowels;
    result += pool[Math.floor(Math.random() * pool.length)];
  }
  return result;
}

export function generateNumberUnique(length = 12): string {
  const numeric = randomUUID().replace(/\D/g, '');
  return numeric.slice(0, length);
}

export function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]+/g, '');
}

export function generateTraceId(): string {
  return `trc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}