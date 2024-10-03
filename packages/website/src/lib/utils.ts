export function containsUppercase(str: string) {
  return /^[A-Z]+$/.test(str)
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}
