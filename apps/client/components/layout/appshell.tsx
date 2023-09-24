import {
  AppShell,
  Burger,
  Center,
  Header,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import type { ReactNode } from "react";
import { useState } from "react";
import HeaderLayout from "./headerLayout";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      asideOffsetBreakpoint="sm"
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                color={theme.colors.gray[6]}
                mr="xl"
                onClick={() => {
                  setOpened((o) => !o);
                }}
                opened={opened}
                size="sm"
              />
            </MediaQuery>
            <HeaderLayout />
          </div>
        </Header>
      }
      navbarOffsetBreakpoint="sm"
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
    >
      <Center>{children}</Center>
    </AppShell>
  );
}
