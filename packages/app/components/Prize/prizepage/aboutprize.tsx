import { Badge, Group,Text } from '@mantine/core'
import React from 'react'

export default function AboutPrize() {
  return (
    <div className='w-full my-4'>
      <Group position='apart' grow>
        <Text weight={600}>
            Deadline: 30 March 2023
        </Text>
        <Badge color="green" className='h-8 font-bold'>$500</Badge>
      </Group>
    </div>
  )
}
