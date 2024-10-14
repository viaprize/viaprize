'use client'

import { sleep } from '@/lib/utils'
import { api } from '@/trpc/react'
import { Button } from '@viaprize/ui/button'
import { Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const DeployPrizeButton = ({ prizeId }: { prizeId: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const mutation = api.prizes.deployPrize.useMutation()
  const handleDeploy = async () => {
    setLoading(true)
    await mutation.mutateAsync({
      prizeId: prizeId,
    })
    router.refresh()

    await sleep(2000)
    setLoading(false)
    window.location.reload()
  }

  return (
    <Button
      className="w-full"
      onClick={handleDeploy}
      disabled={mutation.isPending || loading}
    >
      <Rocket className="mr-2 h-4 w-4" /> Deploy
    </Button>
  )
}
