import { Group, Select, Text } from '@mantine/core';
import { IconArrowDownDashed } from '@tabler/icons-react';
import { forwardRef, useState } from 'react';
interface Token {
  code: string;
  icon: string;
  address: string;
}

interface TokenSelectProps {
  tokens: Token[];
}
const SelectItem = forwardRef<HTMLDivElement, Token>(
  ({ code, icon, ...others }: Token, ref) => (
    <div ref={ref} {...others}>
      <Group>
        {/* Render the SVG icon */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <span dangerouslySetInnerHTML={{ __html: icon }} />
        <Text>{code}</Text>
      </Group>
    </div>
  ),
);

export const TokenSelect = ({ tokens }: TokenSelectProps) => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const tokenOptions = tokens.map((token) => ({
    value: token.address,
    code: token.code,
    icon: token.icon,
  }));

  const handleChange = (value: string | null) => {
    setSelectedToken(value);
  };

  return (
    <Select
      placeholder="Select token"
      value={selectedToken}
      onChange={handleChange}
      data={tokenOptions}
      itemComponent={SelectItem}
      icon={<IconArrowDownDashed />}
      dropdownPosition="bottom"
      transition="pop-top-left"
    />
  );
};
