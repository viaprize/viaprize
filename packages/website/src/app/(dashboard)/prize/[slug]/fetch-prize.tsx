import { api } from '@/trpc/server'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function FetchPrize({ slug }: { slug: string }) {
  const prize = await api.prizes.getPrizeById(slug)
  if (!prize) {
    notFound()
  }
  return <div>{prize.title}</div>
}
