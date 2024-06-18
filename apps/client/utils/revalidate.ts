/* eslint-disable @typescript-eslint/require-await */
'use server';

import { revalidateTag } from 'next/cache';

export default async function revalidate({ tag }: { tag: string }) {
  revalidateTag(tag);
}
