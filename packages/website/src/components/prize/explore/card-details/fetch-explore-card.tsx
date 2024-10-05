// src/components/fetch-explore-prize.tsx

import type { SearchParams } from '@/lib/utils'
import { api } from '@/trpc/server'
import { prizeFilterParamsSchema } from '@/validators/params'
import { IconArrowsSort, IconFilter } from '@tabler/icons-react'
import { Button } from '@viaprize/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@viaprize/ui/sheet'
import ExploreCard from './explore-card'
import PrizeFilterComponent from './prize-filter-component'

export default async function FetchExplorePrize({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Parse the search parameters using Zod schema
  const params = prizeFilterParamsSchema.parse(searchParams)

  // Parse categories into an array
  const categoriesArray = params.categories
    ? params.categories.split(',').map((item) => item.trim())
    : undefined

  // Parse prizeAmount into min and max values
  let minAmount: number | undefined
  let maxAmount: number | undefined
  if (params.prizeAmount) {
    const [min, max] = params.prizeAmount.split('-').map(Number)
    minAmount = min
    maxAmount = max
  }

  // Fetch filtered prizes from the backend
  const filteredPrizes = await api.prizes.getFilteredPrizes({
    categories: categoriesArray,
    prizeStatus: params.prizeStatus,
    minAmount,
    maxAmount,
    sort: params.sort,
  })
  const activePrizes = await api.prizes.getActivePrizes()
  const deployedPrizes = await api.prizes.getDeployedPrizes()
  return (
    <section>
      <div className="flex w-full justify-between items-center p-6">
        <h2 className="font-semibold">{activePrizes} Active Prizes</h2>
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
      </div>

      <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 pb-3 px-7">
        {deployedPrizes?.map((prize) => (
          <ExploreCard
            key={prize.id}
            funds={prize.funds ?? 0}
            imageUrl={prize.imageUrl ?? ''}
            title={prize.title}
            prizeStage={prize.stage ?? 'NOT_STARTED'}
            numberOfContestants={prize.numberOfContestants ?? 0}
            numberOfFunders={prize.numberOfFunders ?? 0}
            numberOfComments={prize.numberOfComments ?? 0}
            href={`/prize/${prize.slug}`}
          />
        ))}
      </section>
    </section>
  )
}
