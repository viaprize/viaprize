import React from 'react';
import Shell from './shell';

export default function NotAutherized() {
  return (
    <Shell className="h-[75vh] w-full">
      <h1>You are not autherized to view this page</h1>
    </Shell>
  );
}
