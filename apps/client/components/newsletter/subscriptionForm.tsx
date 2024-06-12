'use client';

import { Button } from '@mantine/core';
import { useState } from 'react';
import { subscribeToNewsletter } from 'utils/actions';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await subscribeToNewsletter({ email, opt: optIn });
    setLoading(false);
    setEmail('');
  };

  return (
    <div className=" rounded-lg p-8 shadow-lg max-w-md w-full">
      <div className="text-center font-semibold text-lg mb-4">
        Subscribe to our newsletter and stay updated!
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            id="EMAIL"
            name="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="OPT_IN"
            name="OPT_IN"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="OPT_IN" className="text-sm">
            I agree to receive your newsletters
          </label>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          You may unsubscribe at any time using the link in our newsletter.
        </div>
        <Button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
          loading={loading}
        >
          SUBSCRIBE
        </Button>
      </form>
    </div>
  );
}
