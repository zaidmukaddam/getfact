/**
 * Get random alphanumeric string of length n
 *
 * @param length number
 * @returns string
 */
function randomAlphanumericString(length: number): string {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

export { randomAlphanumericString };
