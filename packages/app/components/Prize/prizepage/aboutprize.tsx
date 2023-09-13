import { TextEditor } from '@/components/richtexteditor/textEditor'
import { Badge, Group,Text, Title } from '@mantine/core'
import React from 'react'
import { PrizeCreationTemplate } from './defaultcontent'

export default function AboutPrize() {
  return (
    <div className='w-full my-4'>
      <Group position='apart' grow>
        <Text weight={600}>
            Deadline: 30 March 2023
        </Text>
        <Badge color="green" className='h-8 font-bold'>$500</Badge>
      </Group>
      <div className='py-4'>
        <Title order={4} className='mb-2'>
          About the prize
        </Title>
      <TextEditor disabled richtext={PrizeCreationTemplate}/>
      </div>
    </div>
  )
}
