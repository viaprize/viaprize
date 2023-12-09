import { Button } from '@mantine/core';
import { cn } from 'utils/tailwindmerge';
import useAppUser from '@/context/hooks/useAppUser';

export default function ShouldLogin({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { loginUser } = useAppUser();
  return (
    <div
      className={cn(
        'w-full h-screen flex flex-col justify-center items-center gap-2',
        className,
      )}
    >
      <h1 className={cn('text-3xl font-bold')}>{text}</h1>
      <Button onClick={() => void loginUser()}>Login</Button>
    </div>
  );
}
