import { Card, Group, Badge, Button, Text, Flex, Avatar } from '@mantine/core'
import React from 'react'
import Image from 'next/image'

export default function PrizeFunderCard({ name, email }: { name: string, email: string }) {

    return (
        <Card shadow="xs" padding="lg" my="md" radius="md" withBorder className='flex justify-between items-center'>
            <Group>
                <Avatar color="blue" radius="md"

                    alt='creator'
                    className='rounded-sm'
                />
                <div>
                    <Text variant='p' fw="bold" my="0px" className='leading-[15px]'>
                        Proposer Name:    {name}
                    </Text>
                    <Text variant='p' fw="bold" my="0px" className='leading-[15px]'>
                        Proposer Email:    {email}
                    </Text>
                    {/* <Text c='dimmed' fz="sm">
                        wallett address
                    </Text> */}
                </div>
            </Group>
            {/* <Badge>
                $500
            </Badge> */}
        </Card>
    )
}
