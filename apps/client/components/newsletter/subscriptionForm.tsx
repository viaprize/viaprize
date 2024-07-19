'use client';

import { Button, Input ,Text} from '@mantine/core';
import { useState } from 'react';
import { subscribeToNewsletter } from 'utils/actions';
import { toast } from 'sonner';
import { IconBell, IconBellRinging, IconMailFilled } from '@tabler/icons-react';

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
    <div className="rounded-xl p-3 shadow-lg w-full   bg-gradient-to-r bg-cyan-50">
      <div className="font-bold ml-2 flex items-center space-x-2">
        <IconBell /> <Text fw='bold'>Subscribe to our Newsletter!</Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lg:flex lg:space-x-2 space-y-2 lg:space-y-0 items-center ">
          <Input
            type="email"
            id="EMAIL"
            name="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
            leftSection={<IconMailFilled />}
            className="w-full lg:w-2/3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="w-full lg:w-1/3 bg-[#4f8597]" loading={loading}>
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
