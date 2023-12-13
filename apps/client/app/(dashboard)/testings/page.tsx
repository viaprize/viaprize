'use client';

import { Button } from '@mantine/core';

export default function Testing() {
  
  const handleClick = async () => {
    const data = {
      login_id: 'test@sunbasedata.com',
      password: 'Test@123',
    };
    console.log(data);
    const response = await fetch(
      'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
      },
    );
    console.log(response);
    console.log('response');
    return response;
  };

  return (
    <Button
      onClick={() => {
        void handleClick();
      }}
    >
      test
    </Button>
  );
}
