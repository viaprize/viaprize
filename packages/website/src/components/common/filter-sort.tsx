import { IconArrowsSort, IconFilter } from '@tabler/icons-react'
import { Button } from '@viaprize/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@viaprize/ui/sheet'
import PrizeFilterComponent from '../prize/explore/card-details/prize-filter-component'

export default function FilterSort() {
  return (
    <div className="flex space-x-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">
            <IconFilter className="mr-2" /> Filter
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          <PrizeFilterComponent />
        </SheetContent>
      </Sheet>
      <Button variant="secondary">
        <IconArrowsSort className="mr-2" /> Sort by
      </Button>
    </div>
  )
}
