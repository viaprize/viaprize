'use client';

import { Button, Input } from '@mantine/core';
import { useState } from 'react';
import { subscribeToNewsletter } from 'utils/actions';
import { toast } from 'sonner';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  // const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await subscribeToNewsletter({ email }); //, opt: optIn
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-2 shadow-lg w-1/3 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="font-bold ml-2">Subscribe to our Newsletter!</div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <Input
            type="email"
            id="EMAIL"
            name="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="w-[40%]" loading={loading}>
            SUBSCRIBE
          </Button>
        </div>
        {/* <div className="mb-4 flex items-center">
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
        </div> */}
        {/* <div className="text-xs text-gray-500 mb-4">
          You may unsubscribe at any time using the link in our newsletter.
        </div> */}
      </form>
    </div>
  );
}
