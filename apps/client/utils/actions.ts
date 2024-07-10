'use server';

import { env } from '@env';

export async function subscribeToNewsletter({
  email,
  // opt,
}: {
  email: string;
  // opt: boolean;
}) {
  const response = await fetch(env.NEXT_PUBLIC_BREVO_NEWSLETTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      EMAIL: email,
      // OPT_IN: opt ? '1' : '0',
    }).toString(),
  }).catch((error) => {
    console.error(error);
    throw new Error('Failed to subscribe');
  });
  console.log(response);
}
