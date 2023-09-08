import { Button } from '@mantine/core'
import React from 'react'

export default function Submissions() {
  return (
    <div>
      <Button className='absolute bottom-6 right-6'
      component='a'
      href='/prize/editor'
      >
        Submit your work
      </Button>
    </div>
  )
}
