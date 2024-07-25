import * as nanoid from 'nanoid';
export async function generateId(size = 5) {
  const id = nanoid.customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    size,
  );
  return id;
}
