import { IconArrowsSort, IconFilter } from '@tabler/icons-react'
import { Button } from '@viaprize/ui/button'

export default function FilterSort() {
  return (
    <div className="flex space-x-3">
      <Button variant="secondary">
        <IconFilter className="mr-2" /> Filter
      </Button>
      <Button variant="secondary">
        <IconArrowsSort className="mr-2" /> Sort by
      </Button>
    </div>
  )
}
