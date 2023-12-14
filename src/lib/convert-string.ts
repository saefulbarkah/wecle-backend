import { nanoid } from 'nanoid';

export function toCapitalizeString(value: string) {
  const results = value.toLowerCase();
  return results
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toSlug(value: string) {
  return value.split(' ').join('-');
}

export function strUUID(text: string) {
  const randomizer = nanoid(10);
  const capTitle = toCapitalizeString(text);
  const slug = `${toSlug(capTitle)}-${randomizer}`;
  return slug;
}
