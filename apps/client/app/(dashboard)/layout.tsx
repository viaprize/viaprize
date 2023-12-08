import AppShellLayout from '@/components/layout/appshell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShellLayout>{children}</AppShellLayout>;
}
