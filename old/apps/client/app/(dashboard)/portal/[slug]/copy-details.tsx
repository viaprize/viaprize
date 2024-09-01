'use client';

import { ActionIcon, Badge, CopyButton, Flex, Text, Tooltip, rem } from '@mantine/core';
import { IconCheck, IconCopy, IconCurrencyEthereum } from '@tabler/icons-react';
import React from 'react';

export default function CopyDetails({ recipientAddress }: { recipientAddress: string }) {
  return (
    <Badge color="gray" p="md">
      <Flex gap="md" justify="center" align="center">
        <Text size="sm">
          {recipientAddress.slice(0, 5)}....{recipientAddress.slice(-5)}
        </Text>
        <IconCurrencyEthereum size={20} />
        <CopyButton value={recipientAddress} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                onClick={copy}
              >
                {copied ? (
                  <IconCheck style={{ width: rem(16) }} />
                ) : (
                  <IconCopy style={{ width: rem(16) }} />
                )}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Flex>
    </Badge>
  );
}
