'use client'

import { api } from '@/trpc/react'
import { Button } from '@viaprize/ui/button'
import { Rocket } from 'lucide-react'

export const DeployPrizeButton = ({ prizeId }: { prizeId: string }) => {
  const mutation = api.prizes.deployPrize.useMutation()
  const handleDeploy = async () => {
    await mutation.mutateAsync({
      prizeId: prizeId,
    })
  }

  return (
    <Button
      className="w-full"
      onClick={handleDeploy}
      disabled={mutation.isPending}
    >
      <Rocket className="mr-2 h-4 w-4" /> Deploy
    </Button>
  )
}
