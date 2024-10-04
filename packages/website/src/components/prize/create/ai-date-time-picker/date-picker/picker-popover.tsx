'use client'

import { useEffect, useState } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Calendar, type CalendarProps } from '@viaprize/ui/calendar'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@viaprize/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@viaprize/ui/popover'
import { TimePicker } from './../time-picker/time-picker'

import { generateDateString } from './date-utils'

type DateTimePickerPopoverProps = Pick<CalendarProps, 'disabled'> & {
  children: React.ReactNode
  onOpen: () => void
  dateTime: Date | undefined
  minDate?: Date
  setDateTime: React.Dispatch<React.SetStateAction<Date | undefined>>
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export function DateTimePickerPopover({
  children,
  onOpen,
  dateTime,
  setDateTime,
  setInputValue,
  disabled,
  minDate,
}: DateTimePickerPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (dateTime) {
      setInputValue(generateDateString(dateTime))
    }
  }, [dateTime, setInputValue])

  if (!isDesktop) {
    return (
      <Drawer
        open={isDrawerOpen}
        onOpenChange={(value) => {
          onOpen()
          setIsDrawerOpen(value)
        }}
        shouldScaleBackground
      >
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="sr-only text-left">
            <DrawerTitle>Date Time Picker</DrawerTitle>
            <DrawerDescription>Select date and time</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col py-5">
            <Calendar
              mode="single"
              selected={dateTime}
              onSelect={setDateTime}
              initialFocus
              className="self-center"
              fromDate={new Date()}
              disabled={(date) => date < new Date()}
            />
            <div className="border-t border-border p-3">
              <TimePicker date={dateTime} setDate={setDateTime} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={(value) => {
        onOpen()
        setIsPopoverOpen(value)
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="center" side="right" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateTime}
          onSelect={setDateTime}
          initialFocus
          disabled={disabled}
        />
        <div className="border-t border-border p-3">
          <TimePicker date={dateTime} setDate={setDateTime} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
