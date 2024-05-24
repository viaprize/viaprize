export async function generateId(size = 5) {
  const { customAlphabet } = await import('nanoid');
  const id = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    size,
  );
  return id;
}
