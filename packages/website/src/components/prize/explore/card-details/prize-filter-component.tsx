'use client'
import { categories } from '@/lib/constant'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import { DualRangeSlider } from '@viaprize/ui/dualrange-slider'
import { Label } from '@viaprize/ui/label'
import { RadioGroup, RadioGroupItem } from '@viaprize/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@viaprize/ui/select'
import { X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

export default function PrizeFilterComponent() {
  const [prizeStatus, setPrizeStatus] = useQueryState('prizeStatus', {
    defaultValue: 'active',
  })

  const [prizeAmount, setPrizeAmount] = useQueryState<number[]>('prizeAmount', {
    serialize: (value: number[]) => value.join('-'),
    parse: (value: string) => value.split('-').map(Number),
  })

  const [selectedCategories, setSelectedCategories] = useQueryState<string[]>(
    'categories',
    {
      serialize: (value: string[]) => value.join(','),
      parse: (value: string) => (value ? value.split(',') : []),
    },
  )

  const [prizeStatusState, setPrizeStatusState] = useState(
    prizeStatus ?? 'active',
  )
  const [prizeAmountState, setPrizeAmountState] = useState<number[]>(
    prizeAmount ?? [0, 100],
  )
  const [selectedCategoriesState, setSelectedCategoriesState] = useState<
    string[]
  >(selectedCategories || [])

  useEffect(() => {
    setPrizeStatusState(prizeStatus ?? 'active')
  }, [prizeStatus])

  useEffect(() => {
    setPrizeAmountState(prizeAmount ?? [0, 10000])
  }, [prizeAmount])

  useEffect(() => {
    setSelectedCategoriesState(selectedCategories ?? [])
  }, [selectedCategories])

  useEffect(() => {
    if (!prizeStatus) {
      setPrizeStatus('active')
    }
  }, [prizeStatus, setPrizeStatus])

  const handleCategoryChange = (category: string) => {
    setSelectedCategoriesState((prev: string[]) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
  }

  const removeCategory = (category: string) => {
    setSelectedCategoriesState((prev: string[]) =>
      prev.filter((c) => c !== category),
    )
  }

  const handleApply = () => {
    setPrizeStatus(prizeStatusState)
    setPrizeAmount(prizeAmountState)
    setSelectedCategories(selectedCategoriesState)
  }

  return (
    <div className="w-full max-w-sm space-y-10 py-5">
      <RadioGroup value={prizeStatusState} onValueChange={setPrizeStatusState}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="active" id="active" />
          <Label htmlFor="active">Active Prizes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ended" id="ended" />
          <Label htmlFor="ended">Ended Prizes</Label>
        </div>
      </RadioGroup>

      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <Label>Min: {prizeAmountState[0]}$</Label>
          <Label>Max: {prizeAmountState[1]}$</Label>
        </div>
        <DualRangeSlider
          value={prizeAmountState}
          onValueChange={setPrizeAmountState}
          min={0}
          max={10000}
          step={100}
        />
      </div>

      <div>
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger id="categories">
            <SelectValue placeholder="Select categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategoriesState.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeCategory(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={handleApply}>
        Apply
      </Button>
    </div>
  )
}
