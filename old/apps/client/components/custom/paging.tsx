'use client';

import { Pagination } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

export default function Paging({ total }: { total?: number }) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagingParam = searchParams?.get('page') ?? '';
  const [activePage, setActivePage] = useState(pagingParam ? parseInt(pagingParam) : 1);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        page: activePage,
      });
      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  return (
    <div className="w-full flex justify-center my-4">
      <Pagination
        total={total ?? 10}
        value={activePage}
        onChange={setActivePage}
        mt="sm"
        disabled={isPending}
      />
    </div>
  );
}
