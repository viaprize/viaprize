import type { MantineColorsTuple } from '@mantine/core';
import { createTheme } from '@mantine/core';

const primary: MantineColorsTuple = [
  '#efebff',
  '#dbd2ff',
  '#b3a3f9',
  '#8870f4',
  '#6445f0',
  '#4e2aed',
  '#411bed',
  '#330fd4',
  '#2c0bbe',
  '#2107a8',
];

export const theme = createTheme({
  colors: {
    primary,
  },
});
