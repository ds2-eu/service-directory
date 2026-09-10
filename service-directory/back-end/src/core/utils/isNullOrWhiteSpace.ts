export function isNullOrWhiteSpace(value: string): boolean {
  
  if (!value) {
    return true;
  }

  return /^\s*$/.test(value);
}