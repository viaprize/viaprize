'use client'

import { cn } from '@viaprize/ui'
import { Button } from '@viaprize/ui/button'
import { Input } from '@viaprize/ui/input'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React, { useState, type KeyboardEvent } from 'react'
import { IoCheckmarkCircle } from 'react-icons/io5'
import useMeasure from 'react-use-measure'

export interface Topic {
  value: string
  label: string
  icon?: string
  description?: string
}

interface TopicsSelectorProps {
  topics: Topic[]
  setSelectedTopics: (topics: Topic[]) => void
  selectedTopics: Topic[]
  allowAddOptions?: boolean
  showOnlySelected?: boolean
  maxAllowed?: number
  topicClassName?: string
  showDescription?: boolean
}

export default function TopicsSelector({
  topics,
  setSelectedTopics,
  selectedTopics,
  allowAddOptions = false,
  showOnlySelected = false,
  maxAllowed,
  topicClassName,
  showDescription = false,
}: TopicsSelectorProps) {
  const [newSubTopic, setNewSubTopic] = useState('')
  const [ref, { height }] = useMeasure()

  const [localTopics, setLocalTopics] = useState<Topic[]>(topics)

  const handleAddSubTopic = () => {
    if (newSubTopic.trim() !== '') {
      const newTopic: Topic = {
        value: newSubTopic,
        label: newSubTopic,
        icon: '📝',
      }
      setLocalTopics((prev) => [...prev, newTopic])
      setSelectedTopics([...selectedTopics, newTopic])
      setNewSubTopic('')
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddSubTopic()
    }
  }

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="w-full">
        <motion.div
          initial={{ height: 'auto' }}
          animate={{ height: height > 0 ? height : 'auto' }}
        >
          <motion.ul ref={ref} className="mt-4 flex w-full flex-wrap gap-2">
            <LayoutGroup>
              <AnimatePresence initial={false} mode="popLayout">
                {localTopics
                  .filter(
                    (topic) =>
                      !showOnlySelected ||
                      selectedTopics.some((item) => item.value === topic.value),
                  )
                  .map((topic) => (
                    <SingleTopic
                      key={topic.value}
                      topic={topic}
                      isSelected={selectedTopics.some(
                        (item) => item.value === topic.value,
                      )}
                      setValues={setSelectedTopics}
                      selectedTopics={selectedTopics}
                      selectedLength={selectedTopics.length}
                      maxAllowed={maxAllowed}
                      topicClassName={topicClassName}
                      showDescription={showDescription}
                    />
                  ))}
              </AnimatePresence>
            </LayoutGroup>
          </motion.ul>
        </motion.div>

        {allowAddOptions && (
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="text"
              value={newSubTopic}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewSubTopic(e.target.value)}
              placeholder="Add new topic"
              className="border px-2 py-1"
            />
            <Button variant="secondary" onClick={handleAddSubTopic}>
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface SingleTopicProps {
  topic: Topic
  setValues: (topics: Topic[]) => void
  isSelected: boolean
  selectedTopics: Topic[]
  selectedLength: number
  maxAllowed?: number
  topicClassName?: string
  showDescription?: boolean
}

function SingleTopic({
  topic,
  setValues,
  isSelected,
  selectedTopics,
  selectedLength,
  maxAllowed,
  topicClassName,
  showDescription,
}: SingleTopicProps) {
  const onClickHandler = () => {
    if (maxAllowed && selectedLength >= maxAllowed && !isSelected) {
      return
    }
    setValues(
      isSelected
        ? selectedTopics.filter((item) => item.value !== topic.value)
        : [...selectedTopics, topic],
    )
  }

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
      <motion.button
        layout
        className={cn(
          'rounded-full bg-lime-300/60 px-4 py-2 font-medium text-lime-800 dark:bg-lime-400/10 dark:text-lime-300',
          isSelected &&
            'border-[#2c2845] bg-lime-950 text-lime-200 dark:bg-lime-950/60 dark:text-lime-300',
          topicClassName,
        )}
        onClick={onClickHandler}
      >
        <motion.div layout className="my-0 flex items-center gap-2 py-0">
          <motion.span layout className="inline-block">
            {topic.icon} {topic.label}
          </motion.span>
          {isSelected && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <IoCheckmarkCircle />
            </motion.span>
          )}
        </motion.div>
        {showDescription && topic.description && (
          <motion.span layout className="text-sm">
            ({topic.description})
          </motion.span>
        )}
      </motion.button>
    </motion.li>
  )
}
